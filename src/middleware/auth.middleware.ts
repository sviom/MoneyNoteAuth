import DBService from '@src/database/db.connection';
import { User } from '@src/model/user.model';
import { CustomError } from '@src/model/error.model';
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

        try {
            // 기존 사용자의 Access token 과 비교
            const existUserResult = await DBService.connection<User>(authSql.checkAccessToken, { accessToken });
            const existUser = existUserResult.rowCount;
            if (existUser < 1) {
                // 다른 Access token이므로 Refresh 토큰으로 확인해야함
                const notExistResult = await DBService.connection<User>(authSql.checkRefreshToken, { refreshToken });
                const zzz = notExistResult.data[0];
                // access token이 다른데 refresh token이 있다? -> 재발급 대상
            }

            // 일치하는게 있으면, 해당 access token을 분석해서, 만료되었는지 확인한다.
            const result: JwtPayload = jwt.verify(accessToken, CryptoService.key) as JwtPayload;
            if (result.exp) {
                const expiredDate = new Date(result.exp);
                if (dayjs(expiredDate).add(7, 'day').isBefore(dayjs())) {
                    // 기존 토큰 모두 만료 시켜야함
                    throw new CustomError('이상한 AccessToken'); // access token이 다른데 Expired date이전이면 탈취당한 토큰으로 간주
                }

                // access token이 만료되었으므로 Refresh token으로 재확인
                const userResult = await DBService.connection<User>(authSql.checkRefreshToken, { id: '', refreshToken });
                if (userResult.rowCount === 1) {
                    const user = userResult.data[0];

                    // Refresh 토큰을 가진 사용자 존재, 다시 발급
                    const newAccessToken = jwt.sign({ name: user.name, email: user.email }, CryptoService.key, { expiresIn: '7 days' });
                    await DBService.connection(authSql.updateUserToken, { id: '', accessToken, newAccessToken: newAccessToken });
                }
            }
        } catch (error) {
            console.error(error);
            console.log('decode : ', decode);
            if (error) {
                /*
                  err = {
                    name: 'TokenExpiredError',
                    message: 'jwt expired',
                    expiredAt: 1408621000
                  }
                */
            }
        }

        // accessToken이 expired date이전인데 다르다?
        // => 탈취당한것 , 오류

        // accessToken의 expired date 이후이면

        // 만료되었을 때 Refresh token으로 체크하고, 맞으면 새로운 Access Token 발급
        // const newaccessToken = jwt.sign({ name: user.name, email: user.email }, CryptoService.key, { expiresIn: '7 days' });

        // DB의 Token 확인
        // 기록에 없으면? => 최초 로그인 => 토큰 생성
        // AccessToken이 다르면 => RefreshToekn이 일치하는지 확인
        // 같으면 => 발급
        // Access token이 만료기간 전이면? => 에러

        // 인증키 만료될 경우

        // 인증토큰 발급
        // Access Token, Refresh token 발급
        // const accessToken = jwt.sign({ name: user.name, email: user.email }, CryptoService.key, { expiresIn: '7 days' });
        // const refreshToken = jwt.sign({ name: user.name, email: user.email }, CryptoService.key, { expiresIn: '30d' });

        // return { accessToken, refreshToken };
    }
}
