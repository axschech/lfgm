import { knex } from '../connection'

export const USERTABLE = 'users';

export interface Schema {
    check: (tableName: string) => boolean;
    create: () => Promise<void>
}

export default async () => {
    console.log(process.env.MYSQL_DATABASE)
    const knexSchema = knex.schema.withSchema(process.env.MYSQL_DATABASE);

    const usersExists = await knexSchema.hasTable(USERTABLE);
    console.log("user exists:", usersExists)
    if (!usersExists) {
        try {
            await knexSchema.createTable('users', function (table) {
                table.increments().primary();
                table.string("username").checkLength('>', 0).notNullable().unique();
                table.string("email").notNullable().unique();
                table.string("password").notNullable();
                table.unique(['email', 'password']);
            })
            
        } catch (e) {
            console.error("failed to create user table");
            process.exit(1)
        }
    }
}