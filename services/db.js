const Sequelize = require('sequelize');

const connectionString = 'postgres://postgres:postgres123@localhost:5432/banking';
const db = new Sequelize(connectionString);

module.exports = db;