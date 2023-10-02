import crypto from 'crypto';

const crypt = (text: string) => {
    const result = crypto.createHash('sha-256').update(text).digest('base64');
    return result;
};

export { crypt };
