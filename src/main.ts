import 'dotenv/config';
import config from 'dotenv';
import DBService from './database/db.connection';

config.config();
console.log('실행1');

import express, { Request, Response } from 'express';
import Controller from './controller/index';

const port = 3011;
const app = express();

(async () => {
    await DBService.setConnection();
    console.log('실행2');

    app.get('/', (req: Request, res: Response) => {
        res.send('Typescript + Node.js + Express Server');
    });
    console.log('실행3');

    app.use('/api', new Controller().router);

    app.listen(port, () => {
        console.log(`app listen, and port is : ${port} `);
    });
})().catch((error) => {
    console.error(error);
});
