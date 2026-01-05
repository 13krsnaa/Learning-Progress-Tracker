const { Pool } = require('pg');

const pool = new Pool(
    process.env.PG_CONNECTION_STRING
        ? {
            connectionString: process.env.PG_CONNECTION_STRING,
            ssl: {
                rejectUnauthorized: false,
            },
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        }
        : {
            user: process.env.PG_USER || 'postgres',
            host: process.env.PG_HOST || 'localhost',
            database: process.env.PG_DATABASE || 'learning_tracker',
            password: process.env.PG_PASSWORD || 'password',
            port: process.env.PG_PORT || 5432,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        }
);

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;
