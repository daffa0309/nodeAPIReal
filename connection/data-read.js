require('dotenv').load();

const mysql = require('mysql');

const connection = mysql.createPool({
    connectionLimit: 100,
    host: process.env.NODE_ENV === 'development' ? process.env.DEV_DB_HOST : process.env.DB_HOST_READ,
    user: process.env.NODE_ENV === 'development' ? process.env.DEV_DB_USER :process.env.DB_USERNAME_READ,
    password: process.env.NODE_ENV === 'development' ? process.env.DEV_DB_PASSWORD :process.env.DB_PASSWORD_READ,
    database: process.env.DB_VISIDATA_READ,
    port: process.env.NODE_ENV === 'development' ? process.env.DEV_DB_PORT :process.env.DB_PORT_READ,
    insecureAuth: true,
    timeout: 30000,
    acquireTimeout: 30000,
    connectTimeout: 30000,
});

module.exports = connection;
