import 'dotenv/config';
import config from 'dotenv';
config.config();

import DBService from './database/db.connection';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import Controller from './controller/index';
import CryptoService from './utils/crypto';
import bodyParser from 'body-parser';

const port = 3011;
const allowList = ['http://localhost:5143'];
const corsOption: CorsOptions = {
    origin: allowList,
    maxAge: 20,
};

const app = express();

app.use(bodyParser.json());
app.use(cors(corsOption));
app.use('/api', new Controller().router);

/** 아래의 메서드들을 즉시 실행하기 위해 즉시실행함수 생성 */
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
