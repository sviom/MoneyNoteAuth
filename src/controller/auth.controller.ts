import AuthService from '@src/service/auth.service';
import express, { Router, Request, Response } from 'express';

export default class AuthController {
    public router: Router = express.Router();

    constructor() {
        this.router.post('/auth', this.getTestMessage);
    }

    getTestMessage(req: Request, res: Response) {
        try {
            new AuthService();
            // service.setAuthCode();

            res.status(200).json({ test: 'test message' });
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    }
}
