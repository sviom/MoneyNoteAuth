import express, { Router } from 'express';
import AuthController from './auth.controller';

export default class Controller {
    public router: Router = express.Router();

    constructor() {
        this.configureRouter();
    }

    configureRouter() {
        this.router.use('/auth', new AuthController().router);
    }
}
