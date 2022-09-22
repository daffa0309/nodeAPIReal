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
      user: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASSWORD,
      database: process.env.DB_PASIEN,
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
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_PASIEN,
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
