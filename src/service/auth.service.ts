import DBService from '@src/database/db.connection';
import authSql from './auth.sql';
import { generateRandomCode } from '@src/utils/auth';
import { User } from '@src/model/user.model';
import { CustomError } from '@src/model/error.model';

class AuthCode {
    public code: string = '';
}

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
    } else if (!user.id) {
        error.message = '사용자의 아이디가 잘못되었습니다. 올바른 값을 입력해주세요.';
    } else if (!user.passwword) {
        error.message = '비밀번호가 입력되지 않았습니다. 비밀번호를 입력해주세요.';
    } else if (!passwordRegx.test(user.passwword)) {
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
    async setAuthCode(user: User): Promise<boolean | CustomError> {
        try {
            // 나머지 값들이 잘 들어왔는지 Validation
            const validateResult = validate(user);
            if (!validateResult.success) return validateResult.error || new CustomError('예상치 못한 이슈가 발생했습니다.', -1);

            // 인증코드 만들기(난수)
            const code = generateRandomCode(6);
            user.authCode = code;

            // 서버에 해당 이메일이 있는지 확인 인증코드 저장
            const service = new DBService();
            const result = await service.query<AuthCode, User>(authSql.setAuthCode, user);

            console.log(result.data);
            if (result.data.length < 2) return new CustomError('test', -1);

            const authCode = result.data[0];
            console.log(authCode);

            // 암호화
            // 주소/api/auth/auth post 로 링크 만들기
            // 이메일 보내기
            return true;
        } catch (error) {
            console.error(error);
            return new CustomError('test', -1);
        }
    }
}

export { validate };
