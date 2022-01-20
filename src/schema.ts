import { knex } from './connection'

export const USERTABLE = 'users';

export default async () => {
    console.log(process.env.MYSQL_DATABASE)
    const knexSchema = knex.schema.withSchema(process.env.MYSQL_DATABASE);

    const usersExists = await knexSchema.hasTable(USERTABLE);
    console.log("user exists:", usersExists)
    if (!usersExists) {
        try {
            await knexSchema.createTable('users', function (table) {
                table.increments();
                table.string("username");
                table.string("email");
                table.string("password");
            })
        } catch (e) {
            console.error("failed to create user table");
            process.exit(1)
        }
    }
}