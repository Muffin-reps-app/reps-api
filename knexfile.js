module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            user: 'admin',
            password: 'pass',
            database: 'muffin_app'
        },
        migrations: {
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    }
}
