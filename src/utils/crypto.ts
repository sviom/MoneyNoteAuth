import crypto from 'crypto';
import { getVaultSecret } from './keyvault';

class CryptoService {
    private static iv: string;
    private static key: string;

    static async setKey() {
        CryptoService.iv = await getVaultSecret('mnkiv');
        CryptoService.key = await getVaultSecret('mnkey');
    }

    /** 해시 암호화 */
    static crypt = (text: string) => {
        const result = crypto.createHash('sha-256').update(text).digest('base64');
        return result;
    };

    /** 암호화 */
    static cipher = (password: string) => {
        const encrypt = crypto.createCipheriv('aes-256-ocb', CryptoService.key, CryptoService.iv); // des알고리즘과 키를 설정
        const encryptResult =
            encrypt.update(password, 'utf8', 'base64') + // 암호화
            encrypt.final('base64'); // 인코딩

        return encryptResult;
    };

    /** 복호화 */
    static decipher = (password: string) => {
        const decode = crypto.createDecipheriv('aes-256-ocb', CryptoService.key, CryptoService.iv);
        const decodeResult =
            decode.update(password, 'base64', 'utf8') + // 암호화된 문자열, 암호화 했던 인코딩 종류, 복호화 할 인코딩 종류 설정
            decode.final('utf8'); // 복호화 결과의 인코딩

        return decodeResult;
    };
}

export default CryptoService;
