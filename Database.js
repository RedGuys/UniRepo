const pg = require('pg');
const logger = require('log4js').getLogger('Database');

module.exports = class Database {
    constructor() {
        this._pool = new pg.Pool({
            connectionString: process.env.DATABASE_URL
        });
    }

    async createTables() {
        logger.debug("Creating tables");
        await this._pool.query(`
            create table if not exists repositories
            (
                id      uuid default gen_random_uuid()
                    primary key,
                name    text,
                storage json default '{}',
                status  text,
                handler json default '{}',
                access  json default '{}'
            );`);
        logger.debug("Tables created");
    }

    async getRepositories() {
        return (await this._pool.query(`select * from repositories`)).rows;
    }
}