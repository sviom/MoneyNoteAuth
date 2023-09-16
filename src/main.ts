import express, { Request, Response } from 'express';

const port = 3011;
const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Typescript + Node.js + Express Server');
});

app.listen(port, () => {
    console.log('app listen ');
});
