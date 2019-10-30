require('dotenv').config()
const Sequelize = require('sequelize')

module.exports = new Sequelize(process.env.LOCAL_DB_NAME, process.env.LOCAL_DB_USERNAME, process.env.LOCAL_DB_PASSWORD, {
    host: process.env.LOCAL_DB_HOSTNAME,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false,
    define: {
        timestamps: true
    }
})