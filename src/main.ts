import 'dotenv/config';
import config from 'dotenv';
import DBService from './database/db.connection';

config.config();
console.log('실행1');

import express from 'express';
import Controller from './controller/index';
import CryptoService from './utils/crypto';

const port = 3011;
const app = express();

app.use('/api', new Controller().router);

(async () => {
    /** 암호화를 위한 정보 가져오기 */
    await CryptoService.setKey();
    /** DB연결 미리 해놓기 */
    await DBService.setConnection();
    app.listen(port, () => {
        console.log(`app listen, and port is : ${port} `);
    });
})().catch((error) => {
    console.error(error);
});
