const authSql = {
    setAuthCode: `
        INSERT INTO [User] (id, name, email, password, createdTime, updatedTime, isApproved, authCode)
        VALUES (@id, @name, @email, @password, GETDATE(), NULL, FALSE, @authCode);
    `,
    getUserList: `
        SELECT *
        FROM [User];
    `,
};

export default authSql;
