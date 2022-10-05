import Knex from "knex";

export const knex = Knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    debug: false
  }
})