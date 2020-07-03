import Sequelize from 'sequelize';

const conn = new Sequelize(process.env.MYSQL_DATABASE, 'root', process.env.MYSQL_ROOT_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging:false
});

conn.authenticate().catch(() => {
    console.log("auth failed");
});

export default conn;