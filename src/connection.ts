import Knex from "knex";

export const knex = Knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    debug: false
  }
})