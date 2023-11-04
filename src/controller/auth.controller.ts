import { User } from '@src/model/user.model';
import AuthService from '@src/service/auth.service';
import express, { Router, Request, Response } from 'express';

export default class AuthController {
    public router: Router = express.Router();

    constructor() {
        /** 인증 */
        this.router.post('/auth', this.setPreUser);
        /** 인증코드입력과 더불은 회원 가입 절차 */
        this.router.post('/user', this.setUser);
        /** 로그인 */
        this.router.post('/signin', this.signin);
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

            if (typeof result === typeof Boolean) res.status(200).json({ test: 'test message', result: result });
            else res.status(500).json({ test: 'test message', result: result });
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    }

    async setUser(req: Request, res: Response) {
        try {
            const { name, email, password, authCode } = req.body as { name: string; email: string; password: string; authCode: string };

            const user = new User();
            user.name = name;
            user.email = email;
            user.password = password;

            const service = new AuthService();
            const result = await service.setUser(user, authCode);

            res.status(200).json({ test: 'test message', result: result });
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    }

    async signin(req: Request, res: Response) {
        try {
            const { name, password } = req.body as { name: string; password: string };

            const service = new AuthService();
            const result = await service.signIn(name, password);

            res.status(200).json({ test: 'test message', result: result });
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    }
}
