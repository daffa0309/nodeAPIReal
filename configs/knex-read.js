require('dotenv').config();

const Knex = require('knex');

const client = {
    client: 'mysql',
};
  
const pool = {
    pool: {min: 0, max: 100},
};
  
const development = {
    ...client,
    connection: {
        host: process.env.DEV_DB_HOST,
        password: process.env.DEV_DB_PASSWORD,
        user: process.env.DEV_DB_USER,
        database: process.env.DEV_DB,
        port: process.env.DEV_DB_PORT,
        connTimeout: 30000,
        connectTimeout: 30000,
        requestTimeout: 30000,
        connectionTimeout: 30000,
    },
    ...pool,
};
  
const production = {
    ...client,
    connection: {
        database: process.env.DB_KLINIK_READ,
        host: process.env.DB_HOST_READ,
        password: process.env.DB_PASSWORD_READ,
        user: process.env.DB_USERNAME_READ,
        connTimeout: 30000,
        connectTimeout: 30000,
        requestTimeout: 30000,
        connectionTimeout: 30000,
    },
    ...pool,
};
  
module.exports = (env) => {
    if (env === 'development') {
      return new Knex(development);
    }
  
    return new Knex(production);
};
