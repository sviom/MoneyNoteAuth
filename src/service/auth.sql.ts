const authSql = {
    checkEmailDuplicate: `
        SELECT *
        FROM [User]
        WHERE email = $email;
    `,
    setPreUser: `
        INSERT INTO PreUser (authCode)
        OUTPUT inserted.id
        VALUES ($authCode);
    `,
    deletePreUser: `
        DELETE PreUser
        WHERE authCode = $authCode;
    `,
    setUser: `
        INSERT INTO [User] (name, email, password, createdTime, updatedTime, isApproved, authCode)
        VALUES ($name, $email, $password, GETDATE(), NULL, 1, $authCode);
    `,
    getAuthCode: `
        SELECT *
        FROM PreUser
        WHERE authCode = $authCode;
    `,
    signIn: `
        SELECT *
        FROM [User]        
        WHERE name = $name
            AND password = $password;
    `,
    signInUpdateToken: `
        UPDATE [User]
        SET accessToken  = $accessToken,
            refreshToken = $refreshToken
        WHERE id = $id
    `,
    checkAccessToken: `
        SELECT *
        FROM [User]
        WHERE accessToken = $accessToken;
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
