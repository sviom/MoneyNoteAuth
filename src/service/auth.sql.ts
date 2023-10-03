const authSql = {
    setPreUser: `
        INSERT INTO PreUser (authCode)
        OUTPUT inserted.id
        VALUES ($authCode);
    `,
    setUser: `
        INSERT INTO [User] (name, email, password, createdTime, updatedTime, isApproved, authCode)
        VALUES ($name, $email, $password, GETDATE(), NULL, 0, $authCode);
    `,
    getAuthCode: `
        SELECT *
        FROM PreUser
        WHERE authCode = $authCode;
    `,
    getUserList: `
        SELECT *
        FROM [User];
    `,
};

export default authSql;
