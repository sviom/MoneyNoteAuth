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

//
// INSERT INTO [User] (id, name, email, password, createdTime, updatedTime, isApproved, authCode)
// VALUES (@id, @name, @email, @password, GETDATE(), NULL, FALSE, @authCode);
export { User };
