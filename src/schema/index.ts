import { knex } from '../connection';
import { iSchema } from './schema';
import UserSchema from './user';

export const USERTABLE = 'users';

export default async () => {
    const knexSchema = knex.schema.withSchema(process.env.MYSQL_DATABASE)
    const schemas: iSchema[] = [
        new UserSchema({tableName: USERTABLE, knexSchema})
    ];

    const results = await Promise.all(schemas.map(async (schema) => ({
        tableName: schema.tableName,
        result: await schema.init()
    })));

    return results.map(({tableName, result}) => {
        return `${tableName}: ${result}`
    }).join(`\n`)
}