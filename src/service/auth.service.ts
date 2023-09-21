import DBService from 'src/database/db.connection';

export default class AuthService {
    setAuthCode() {
        // 인증코드 만들기(난수)
        // 서버에 해당 이메일이 있는지 확인 인증코드 저장
        const service = new DBService();
        service.query('');

        // 암호화
        // 주소/api/auth/auth post 로 링크 만들기
        // 이메일 보내기
    }
}
