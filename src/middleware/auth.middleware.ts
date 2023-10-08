import DBService from '@src/database/db.connection';
import { User } from '@src/model/user.model';
import { CustomError, errorCode } from '@src/model/error.model';
import authSql from '@src/service/auth.sql';
import CryptoService from '@src/utils/crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dayjs from 'dayjs';

export default class AuthMiddleware {
    async signIn2(accessToken: string, refreshToken: string) {
        // Access Token의 유효 기간을 짧게 설정한다.
        // Refresh Token의 유효 기간은 길게 설정한다.
        // 사용자는 Access Token과 Refresh Token을 둘 다 서버에 전송하여 전자로 인증하고 만료됐을 시 후자로 새로운 Access Token을 발급받는다.
        // 공격자는 Access Token을 탈취하더라도 짧은 유효 기간이 지나면 사용할 수 없다.
        // 정상적인 클라이언트는 유효 기간이 지나더라도 Refresh Token을 사용하여 새로운 Access Token을 생성, 사용할 수 있음.

        // 데이터베이스에 각 사용자에 1대1로 맵핑되는 Access Token, Refresh Token 쌍을 저장한다.
        // 정상적인 사용자는 기존의 Access Token으로 접근하며 서버측에서는 데이터베이스에 저장된 Access Token과 비교하여 검증한다.
        // 공격자는 탈취한 Refresh Token으로 새로 Access Token을 생성한다. 그리고 서버측에 전송하면 서버는 데이터베이스에 저장된 Access Token과 공격자에게 받은 Access Token이 다른 것을 확인한다.
        // 만약 데이터베이스에 저장된 토큰이 아직 만료되지 않은 경우, 즉 굳이 Access Token을 새로 생성할 이유가 없는 경우 서버는 Refresh Token이 탈취당했다고 가정하고 두 토큰을 모두 만료시킨다.
        // 이 경우 정상적인 사용자는 자신의 토큰도 만료됐으니 다시 로그인해야 한다. 하지만 공격자의 토큰 역시 만료됐기 때문에 공격자는 정상적인 사용자의 리소스에 접근할 수 없다.

        // 기존 사용자의 Access token 과 비교
        const existUserResult = await DBService.connection<User>(authSql.checkAccessToken, { accessToken });
        const existUserCount = existUserResult.rowCount;

        /*
              err = {
                name: 'TokenExpiredError',
                message: 'jwt expired',
                expiredAt: 1408621000
              }
            */
        if (existUserCount === 1) {
            try {
                jwt.verify(accessToken, CryptoService.key) as JwtPayload;
                return;
            } catch (error) {
                const zzz = error as any;
                if (zzz.name === 'TokenExpiredError') {
                    // 기간 만료
                    await this.afterTokenExpire(accessToken, refreshToken);
                }
                return;
            }
        }
    }

    async afterTokenExpire(accessToken: string, refreshToken: string) {
        const notExistResult = await DBService.connection<User>(authSql.checkRefreshToken, { refreshToken });
        if (notExistResult.rowCount <= 0) return new CustomError({ message: errorCode.wrongAccess });

        try {
            const result: JwtPayload = jwt.verify(accessToken, CryptoService.key) as JwtPayload;
            if (result.exp) {
                const expiredDate = new Date(result.exp);
                if (dayjs(expiredDate).add(7, 'day').isBefore(dayjs())) {
                    // 기존 토큰 모두 만료 시켜야함
                    throw new CustomError({ message: errorCode.wrongAccess }); // access token이 다른데 Expired date이전이면 탈취당한 토큰으로 간주
                }
            }

            // Refresh token으로 재확인
            if (notExistResult.rowCount === 1) {
                const user = notExistResult.data[0];
                // Refresh 토큰을 가진 사용자 존재, 다시 발급
                const newAccessToken = jwt.sign({ name: user.name, email: user.email }, CryptoService.key, { expiresIn: '7 days' });
                await DBService.connection(authSql.updateUserToken, { id: '', accessToken, newAccessToken: newAccessToken });
                // 재로그인 대상
            }
        } catch (error) {
            const zzz = error as any;
            if (zzz.name === 'TokenExpiredError') {
                // Refresh token 마저도 만료 되었으므로, 재 로그인 대상안내
                return new CustomError({ message: errorCode.wrongAccess });
            } else {
                return;
            }
        }
    }
}
