import { getVaultSecret } from '@src/utils/keyvault';
import { DBResult } from '@src/model/db.model';
import { Options, Sequelize } from 'sequelize';

export default class DBService {
    private static password = '';
    private static host = '';

    static sequelize: Sequelize;

    static async setConnection() {
        const host = await getVaultSecret('mconnectionhost');
        const password = await getVaultSecret('mconnectionpw');

        this.password = password || '';
        this.host = host || '';

        const config: Options = {
            dialect: 'mssql',
            port: 1433,
            host: this.host,
            database: 'moneynote',
            password: this.password,
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

        this.sequelize = new Sequelize(config);
    }

    static connection = async <T>(query: string, param: any) => {
        console.log('testtest');

        const [results] = await this.sequelize.query(query, {
            bind: param,
        });

        const zz = results as DBResult<T>[];
        return zz;
    };
}
