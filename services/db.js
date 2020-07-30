const Sequelize = require('sequelize');

const connectionString = 'postgres://koichen:postgres123@localhost:5432/db_th';
const db = new Sequelize(connectionString);

module.exports = db;