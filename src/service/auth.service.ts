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

            // 이메일 중복 검사
            const duplicateResult = await DBService.connection<User>(authSql.checkEmailDuplicate, { email: user.email });
            if (duplicateResult.rowCount > 1) return new CustomError({ message: '중복된 이메일이 있습니다.' });

            const code = generateRandomCode(6);

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

    /**
     * 링크 클릭을 통해 들어온 사용자 가입 절차
     * @param user
     * @param authCode
     * @returns
     */
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

    /**
     * 로그인 및 Token 발급
     * @param name 사용자 이름
     * @param password 비밀번호 평문
     * @returns
     */
    async signIn(name: string, password: string) {
        const result = await DBService.connection<User>(authSql.signIn, { name, password: CryptoService.crypt(password) }); // 아이디 암호 체크
        if (result.rowCount !== 1) return new CustomError({ message: '이상한 AccessToken' });

        const user = result.data[0];

        // 인증토큰 발급
        const accessToken = jwt.sign({ name: user.name, email: user.email }, CryptoService.key, { expiresIn: '7 days' });
        const refreshToken = jwt.sign({ name: user.name, email: user.email }, CryptoService.key, { expiresIn: '30d' });

        // 사용자 정보에 업데이트
        await DBService.connection<User>(authSql.signInUpdateToken, { id: user.id, accessToken, refreshToken }); // 아이디 암호 체크

        return { accessToken, refreshToken };
    }
}

export { validate };
