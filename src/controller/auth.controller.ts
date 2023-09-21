import express, { Router, Request, Response } from 'express';

export default class AuthController {
    public router: Router = express.Router();

    constructor() {
        this.router.get('/test', this.getTestMessage);
    }

    getTestMessage(req: Request, res: Response) {
        const query = req.query.test as string;
        console.log('test : ', query);

        res.status(200).json({ test: 'test message' });
    }
}
