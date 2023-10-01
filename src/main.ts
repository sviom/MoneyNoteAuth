import 'dotenv/config';
import config from 'dotenv';
import DBService from './database/db.connection';

config.config();

DBService.setConnection();

import express, { Request, Response } from 'express';
import Controller from './controller/index';

const port = 3011;
const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Typescript + Node.js + Express Server');
});

app.use('/api', new Controller().router);

app.listen(port, () => {
    console.log(`app listen, and port is : ${port} `);
});
