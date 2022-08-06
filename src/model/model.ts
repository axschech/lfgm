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

    async select(where: object, fields?: string[]) {
        return await knex<T>(this.table)
            .where(where).select(fields && fields.length ? fields : '*').first()
            .then((result) => {
                return this.table === 'users' ? FilterUser(result as User) : result;

            });
    }

    async insert(config: any, fields?: string[]): Promise<any> {
        let insertResult;
        try {
            insertResult = await knex<T>(this.table).insert(config);
        } catch(e) {
            return {
                error: "ER_NO_DEFAULT_FOR_FIELD"
            }
        }
        

        if (fields?.length === 0) {
            return insertResult;
        }

        if (!insertResult || insertResult.length === 0) {
            return {
                error: "INSERT_FAILED"
            };
        }

        return await insertResult.reduce(async (prev, id) => ({
            ...prev,
            [id]: await this.select({id}, fields)
        }), {}) 
    }

    isNotEmpty(required: string[]): boolean {
        return required.some((item) => !item);
    }
}