const authSql = {
    checkEmailDuplicate:`
        SELECT *
        FROM [User]
        WHERE email = $emmail;
    `,
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
    signIn: `
        SELECT *
        FROM [User]        
        WHERE name = $name
            AND password = $password;
    `,
    checkAccessToken: `
        SELECT *
        FROM [User]
        WHERE accessToken = '';
    `,
    checkRefreshToken: `
        SELECT
            id,
            name
        FROM [User]
        WHERE id = ''
            AND refreshToken = $refreshToken;
    `,
    updateUserToken: `
        UPDATE [User]
        SET accessToken = $newAccessToken
        WHERE id = ''
            AND accessToken = $accessToken
    `,
};

export default authSql;
