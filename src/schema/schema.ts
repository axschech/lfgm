import { Knex } from 'knex';

export interface iSchema {
    tableName: string;
    hasTable: () => Promise<boolean>;
    createTable: () => Promise<boolean>;
    init: () => Promise<boolean>;
}

interface SchemaParams {
    tableName: string;
    knexSchema: Knex.SchemaBuilder;
}

abstract class BaseSchema implements iSchema {
    tableName: string;
    knexSchema: Knex.SchemaBuilder;

    constructor({tableName, knexSchema}: SchemaParams) {
        this.knexSchema = knexSchema;
        this.tableName = tableName;
    }

    async init() {
        const hasTable = await this.hasTable();

        if (hasTable) {
            return false;
        }

        return this.createTable()
    }

    async hasTable() {
        return false
    };

    async createTable() { return false }
}

export default BaseSchema;
