import { Connection, Request, TYPES } from 'tedious';
import { getConnectionString } from '@src/utils/keyvault';
import { DBResult } from '@src/model/db.model';
import { Options, Sequelize } from 'sequelize';

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

    query = async <T, U>(query: string, param: U) => {
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

        if (param) {
            for (const [key, value] of Object.entries(param)) {
                console.log(`${key}: ${value}`);
                request.addParameter('', TYPES.NVarChar, '');
            }
        }

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

    connection = async <T>(query: string, param: any) => {
        const config: Options = {
            dialect: 'mssql',
            port: 9999,
            host: '',
            database: 'moneynote',
            password: '',
            pool: {
                max: 10,
                idle: 2,
            },
            retry: {
                max: 2,
                timeout: 30000,
            },
            timezone: '+09:00',
            logging: console.log,
            query: {
                raw: true,
            },
        };

        const sequelize = new Sequelize(config);

        const [results] = await sequelize.query(query, {
            bind: param,
        });

        const zz = results as T[];
        return zz;
    };
}
