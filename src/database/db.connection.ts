import sql, { type config } from 'mssql';
import { getConnectionString } from '@src/utils/keyvault';

export default class DBService {
    async connect() {
        const config: config = {
            user: 'username', // better stored in an app setting such as process.env.DB_USER
            password: 'password', // better stored in an app setting such as process.env.DB_PASSWORD
            server: 'your_server.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
            port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
            database: 'AdventureWorksLT', // better stored in an app setting such as process.env.DB_NAME
            options: {
                encrypt: true,
            },
        };
        // authentication: {
        //     type: 'default',
        // },

        const connection = await sql.connect(config);

        return connection;
    }

    async query() {
        try {
            await getConnectionString();
            // const connection = await this.connect();

            // connection.request().query(query);

            // await connection.close();
        } catch (err) {
            console.error('db query error : ', err);
        }
    }
}
