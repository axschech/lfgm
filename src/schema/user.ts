import BaseSchema, { iSchema } from "./schema";

class UserSchema extends BaseSchema implements iSchema {
    async hasTable(): Promise<boolean> {
        const result = await this.knexSchema.hasTable(this.tableName);
        console.log(result);
        return result;
    }

    async createTable(): Promise<boolean> {
        
        try {
            await this.knexSchema.createTable(this.tableName, function (table) {
                table.increments().primary();
                table.string("username").checkLength('>', 0).notNullable().unique();
                table.string("email").notNullable().unique();
                table.string("password").notNullable();
                table.unique(['email', 'password']);
            })
            return true;
        } catch (e) {
            console.error(`failed to create ${this.tableName} table`);
            process.exit(1)
        }
    }
}


export default UserSchema;