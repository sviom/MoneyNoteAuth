import AuthService from '@src/service/auth.service';
import express, { Router, Request, Response } from 'express';

export default class AuthController {
    public router: Router = express.Router();

    constructor() {
        // this.router.post('/auth', this.getTestMessage);
        this.router.get('/auth', this.getTestMessage);
        this.router.post('/user', this.setUser);
    }

    async getTestMessage(req: Request, res: Response) {
        try {
            const service = new AuthService();
            const result = await service.getAuthCodeList();

            res.status(200).json({ test: 'test message', result: result });
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    }

    async setUser(req: Request, res: Response) {
        try {
            const service = new AuthService();
            const result = await service.setUser();

            res.status(200).json({ test: 'test message', result: result });
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    }
}
