import sql from 'mssql';
import { getConnectionString } from '@src/utils/keyvault';

export default class DBService {
    async connect() {
        const connString = await getConnectionString();
        if (!connString) return null;

        const connection = await sql.connect(connString);

        return connection;
    }

    async query(query: string) {
        try {
            const connection = await this.connect();
            if (!connection) return null;

            connection.request().query(query);

            // await connection.close();
        } catch (err) {
            console.error('db query error : ', err);
        }
    }
}
