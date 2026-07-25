const { Pool } = require("pg");
//import pool from the pg package (pool = connection pool)

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
});

module.exports = pool;
//When another file imports this file, give them this pool
