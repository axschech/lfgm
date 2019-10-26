import Sequelize from 'sequelize';
console.log(process.env)
const conn = new Sequelize(process.env.MYSQL_DATABASE, 'root', process.env.MYSQL_ROOT_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});
conn.authenticate().then((test) => {
    console.log(test)
}).catch((err) => {
    console.log(err, 'err');
})
export default conn;