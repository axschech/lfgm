import { knex } from '../connection';
import { FilterUser, User } from './user';

export interface Model<T> {
    knexWrapper: KnexWrapper<T>
    getById(id: Number): Promise<T>
    get(where: object, fields?: string): Promise<T>
}

export class KnexWrapper<T> {
    table: string;
    constructor(table: string) {
        this.table = table;
    }

    async select(where: object, fields: string = "") {
        return await knex<T>(this.table)
            .where(where).select(fields).first()
            .then((result) => {
                return this.table === 'users' ? FilterUser(result as User) : result;

            });
    }

    async insert(config: object[] | object) {
        return await knex(this.table)
            .insert(config)
    }
}