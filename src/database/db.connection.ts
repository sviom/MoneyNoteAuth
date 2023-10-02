import { getVaultSecret } from '@src/utils/keyvault';
import { DBResult } from '@src/model/db.model';
import { Options, Sequelize } from 'sequelize';

export default class DBService {
    static password = '';
    static host = '';

    static sequelize: Sequelize;

    static async setConnection() {
        const host = await getVaultSecret('mconnectionhost');
        const password = await getVaultSecret('mconnectionpw');

        DBService.password = password || '';
        DBService.host = host || '';

        const config: Options = {
            username: 'kanghanstar',
            dialect: 'mssql',
            port: 1433,
            host: host,
            database: 'moneynote',
            password: password,
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
            dialectOptions: {
                useUTC: false,
            },
        };

        DBService.sequelize = new Sequelize(config);
    }

    static connection = async <T>(query: string, param: any) => {
        await DBService.sequelize.authenticate();

        const [results] = await DBService.sequelize.query(query, {
            bind: param,
        });

        const zz = results as DBResult<T>[];
        return zz;
    };
}
