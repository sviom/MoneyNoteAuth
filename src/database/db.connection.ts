import { Connection, Request } from 'tedious';
import { getConnectionString } from '@src/utils/keyvault';
import { DBResult } from '@src/model/db.model';

export default class DBService {
    async connect() {
        const connString = await getConnectionString();
        if (!connString) return null;

        // const connection = await sql.connect(connString);

        const config = {
            server: '192.168.1.210', // or "localhost"
            options: {},
            authentication: {
                type: 'default',
                options: {
                    userName: 'test',
                    password: 'test',
                },
            },
        };

        const connection = new Connection(config);

        return connection;
    }

    query = async <T>(query: string) => {
        const returnValue = new DBResult<T>();

        const connection = await this.connect();
        if (!connection) return returnValue;

        const request = new Request(query, function (err, rowCount) {
            if (err) {
                console.log(err);
            } else {
                console.log(rowCount + ' rows');
                returnValue.rowCount = rowCount;
                // and we close the connection
                connection.close();
            }
        });

        request.on('row', function (columns) {
            columns.forEach(function (column) {
                console.log(column.value);
                const aa = column as T;
                returnValue.data.push(aa);
            });
        });

        connection.execSql(request);

        return returnValue;
    };
}
