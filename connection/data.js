require('dotenv').config();

const mysql = require('mysql');

/** @type {mysql.PoolConfig} */
const devConfig = {
    connectionLimit: 100,
    host: process.env.DEV_DB_HOST,
    user: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB,
    port: process.env.DEV_DB_PORT,
    insecureAuth: true,
    timeout: 30000,
    acquireTimeout: 30000,
    connectTimeout: 30000,
};

/** @type {mysql.PoolConfig} */
const prodConfig = {
    connectionLimit: 100,
    host: process.env.DEV_DB_HOST,
    user: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB,
    port: process.env.DEV_DB_PORT,
    insecureAuth: true,
    timeout: 30000,
    acquireTimeout: 30000,
    connectTimeout: 30000,
}

const activeConfig = (process.env.NODE_ENV === 'development') ? devConfig : prodConfig;
console.log(activeConfig);
const connection = mysql.createPool(activeConfig);

module.exports = connection;
