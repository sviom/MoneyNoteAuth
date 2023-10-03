import { PreUser, User } from '@src/model/user.model';
import AuthService from '@src/service/auth.service';
import CryptoService from '@src/utils/crypto';
import express, { Router, Request, Response } from 'express';

export default class AuthController {
    public router: Router = express.Router();

    constructor() {
        // this.router.post('/auth', this.getTestMessage);
        this.router.get('/auth', this.getTestMessage);
        this.router.post('/auth', this.setPreUser);
        this.router.get('/user', this.setUser);
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

    async setPreUser(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body as { name: string; email: string; password: string };

            const user = new User();
            user.name = name;
            user.email = email;
            user.password = password;

            const service = new AuthService();
            const result = await service.setPreUser(user);

            res.status(200).json({ test: 'test message', result: result });
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    }

    async setUser(req: Request, res: Response) {
        try {
            const { message } = req.query as { message: string };
            const info: PreUser = JSON.parse(CryptoService.decipher(message)) as PreUser;

            let user = new User();
            user = info.user || new User();

            const service = new AuthService();
            const result = await service.setUser(user, info.authCode);

            res.status(200).json({ test: 'test message', result: result });
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    }
}
