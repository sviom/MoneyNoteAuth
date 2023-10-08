import express, { Router, Request, Response, NextFunction } from 'express';
import AuthController from './auth.controller';
import AuthMiddleware from '@src/middleware/auth.middleware';

export default class Controller {
    public router: Router = express.Router();

    constructor() {
        this.configureRouter();
    }

    configureRouter() {
        this.router.use('/auth', new AuthController().router);

        // 인증관련 기능은 Middleware에서 동작하지 않게
        this.router.use(async (req: Request, res: Response, next: NextFunction) => {
            const test = req.headers.cookie as { accessToken?: string; refreshToken?: string };
            const middleware = new AuthMiddleware();
            await middleware.checkToken(test.accessToken || '', test.refreshToken || '');
            next();
        });
    }
}
