import { createConnection, Connection } from "typeorm";
import { User } from './entity/User';
import { Game } from './entity/Game';

export const connection = createConnection({
    entities: [User, Game],
    type: "mysql",
    synchronize: true,
    logging: true,
    username: "root",
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
});