import { createConnection, Connection } from "typeorm";
import { User } from './entity/User';

export const connection = createConnection({
    entities: [User],
    type: "mysql",
    synchronize: true,
    logging: true,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
});