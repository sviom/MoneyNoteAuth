import crypto from 'crypto';
import { getVaultSecret } from './keyvault';

class CryptoService {
    private static salt: string;
    static key: string;

    static async setKey() {
        CryptoService.key = await getVaultSecret('mnkey');
        CryptoService.salt = await getVaultSecret('mniv');
    }

    /** 해시 암호화 */
    static crypt = (text: string) => {
        const result = crypto.createHash('sha-256').update(text).digest('base64');
        return result;
    };

    /** 암호화 */
    static cipher = (text: string) => {
        const iv = crypto.randomBytes(16);
        const key = crypto.scryptSync(CryptoService.key, CryptoService.salt, 32);

        const encrypt = crypto.createCipheriv('aes-256-cbc', key, iv);
        const encryptResult = encrypt.update(text); // , 'utf8', 'base64');
        const encrypted = Buffer.concat([encryptResult, encrypt.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    };

    /** 복호화 */
    static decipher = (text: string) => {
        const textParts = text.split(':');
        const parts = textParts.shift() || '';
        const iv = Buffer.from(parts, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const key = crypto.scryptSync(CryptoService.key, CryptoService.salt, 32);

        const decode = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decode.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decode.final()]);
        return decrypted.toString();
    };
}

export default CryptoService;
