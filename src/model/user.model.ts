class User {
    name: string;
    id: string;
    email: string;
    password: string;
    createdTime: Date;
    authCode: string;

    constructor() {
        this.name = '';
        this.id = '';
        this.email = '';
        this.password = '';
        this.createdTime = new Date();
        this.authCode = '';
    }
}

class PreUser {
    id: string;
    authCode: string;
    createdTime: Date;

    user: User | null = null;

    constructor() {
        this.id = '';
        this.authCode = '';
        this.createdTime = new Date();
    }
}

export { User, PreUser };
