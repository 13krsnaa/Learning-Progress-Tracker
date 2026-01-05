const pool = require('./src/db/postgres');

async function migrate() {
    try {
        console.log('Starting migration: Adding unique indexes to users table...');

        // Ensure table exists (though it should)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Add unique indexes if they don't exist
        // Note: UNIQUE constraint on table definition already creates indexes, 
        // but let's be explicit or add them if the table was created differently before.

        await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);');
        await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);');

        console.log('Migration successful: Indexes added/verified.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
