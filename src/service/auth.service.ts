import DBService from '@src/database/db.connection';
import authSql from './auth.sql';
import { generateRandomCode } from '@src/utils/auth';
import { PreUser, User } from '@src/model/user.model';
import { CustomError } from '@src/model/error.model';
import CryptoService from '@src/utils/crypto';
import { sendMail } from '@src/utils/mail';
import jwt from 'jsonwebtoken';

/**
 * 사용자 정보가 올바른지 체크
 * @param user 사용자 정보
 * @returns 성공 여부 또는 에러
 */
const validate = (user: User): { success: boolean; error: CustomError | null } => {
    const error = new CustomError();

    const returnValue: {
        success: boolean;
        error: CustomError | null;
    } = {
        success: false,
        error: null,
    };

    const passwordRegx = new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/);
    const emailRegex = new RegExp(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/);

    if (!user.name || user.name.length < 3) {
        error.message = '사용자의 닉네임을 입력해주세요.';
    } else if (!user.password) {
        error.message = '비밀번호가 입력되지 않았습니다. 비밀번호를 입력해주세요.';
    } else if (!passwordRegx.test(user.password)) {
        error.message = '올바른 비밀번호를 입력해주세요.';
    } else if (!user.email) {
        error.message = '이메일을 입력해주세요.';
    } else if (!emailRegex.test(user.email)) {
        error.message = '올바른 이메일을 입력해주세요.';
    }

    if (error.message) {
        returnValue.error = error;
    } else {
        returnValue.success = true;
    }

    return returnValue;
};

export default class AuthService {
    async setPreUser(user: User): Promise<boolean | CustomError> {
        try {
            const validateResult = validate(user);
            if (!validateResult.success) return validateResult.error || new CustomError('예상치 못한 이슈가 발생했습니다.', -1);

            const code = generateRandomCode(6);

            // 서버에 해당 이메일이 있는지 확인용 인증코드 저장
            const result = await DBService.connection<{ id: string }>(authSql.setPreUser, { authCode: code });
            const id = result.data[0].id;

            const preuser = new PreUser();
            preuser.authCode = code;
            preuser.id = id;
            preuser.user = user;

            // 이메일 보내기
            const mail = `http://127.0.0.1:3011/api/auth/user?message=${CryptoService.cipher(JSON.stringify(preuser))}`;

            await sendMail('kanghanstar@gmail.com', mail);

            return true;
        } catch (error) {
            console.error(error);
            return new CustomError('test', -1);
        }
    }

    async setUser(user: User, authCode: string): Promise<boolean | CustomError> {
        try {
            const message = '인증코드가 일치하지 않습니다. 코드를 다시 확인해주세요.';
            if (!authCode) return new CustomError(message, -1);

            const validateResult = validate(user);
            if (!validateResult.success) return validateResult.error || new CustomError('예상치 못한 이슈가 발생했습니다.', -1);

            // AuthCode가 일치하는지 확인
            const checkResult = await DBService.connection<PreUser>(authSql.getAuthCode, { authCode });
            if (checkResult.rowCount < 1) return new CustomError(message, -1);

            user.password = CryptoService.crypt(user.password);
            user.authCode = authCode;

            // 서버에 해당 이메일이 있는지 확인용 인증코드 저장
            await DBService.connection<User>(authSql.setUser, user);

            return true;
        } catch (error) {
            console.error(error);
            return new CustomError('test', -1);
        }
    }

    async getAuthCodeList() {
        const result = await DBService.connection<User>(authSql.getUserList, {});
        return result;
    }

    async signIn(name: string, password: string) {
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

        // 아이디 암호 체크
        const result = await DBService.connection<User>(authSql.signIn, { name, password: CryptoService.crypt(password) });
        if (result.rowCount !== 1) return new CustomError('');

        const user = result.data[0];

        // 인증토큰 발급
        // Access Token, Refresh token 발급
        const accessToken = jwt.sign({ name: user.name, email: user.email }, CryptoService.key, { expiresIn: '7 days' });
        const refreshToken = jwt.sign({ name: user.name, email: user.email }, CryptoService.key, { expiresIn: '30d' });

        return { accessToken, refreshToken };
    }
}

export { validate };
