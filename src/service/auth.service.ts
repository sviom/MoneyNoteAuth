import DBService from '@src/database/db.connection';
import authSql from './auth.sql';
import { generateRandomCode } from '@src/utils/auth';
import { User } from '@src/model/user.model';

class AuthCode {
    public code: string = '';
}

export default class AuthService {
    async setAuthCode() {
        // 인증코드 만들기(난수)
        const code = generateRandomCode(6);

        const user = new User();
        user.authCode = code;

        // 서버에 해당 이메일이 있는지 확인 인증코드 저장
        const service = new DBService();
        const result = await service.query<AuthCode, User>(authSql.setAuthCode, user);

        console.log(result.data);
        if (result.data.length < 2) return null;

        const authCode = result.data[0];
        console.log(authCode);

        // 암호화
        // 주소/api/auth/auth post 로 링크 만들기
        // 이메일 보내기
    }
}
