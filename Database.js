const pg = require('pg');
const Database = require("./Database");
const logger = require('log4js').getLogger('Database');

module.exports = class Database {

    static instance = null;

    static getInstance() {
        return Database.instance;
    }

    constructor() {
        Database.instance = this;
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
        await this._pool.query(`
            create table if not exists access_tokens
            (
                id        uuid default gen_random_uuid()
                    primary key,
                token     text,
                repo      text,
                can_read  boolean default true,
                can_write boolean default false
            );`);
        await this._pool.query(`
            create table if not exists packages
            (
                id        uuid default gen_random_uuid()
                    primary key,
                name      text,
                repo      text,
                version   text,
                payload   json default '{}'
            );`);
        logger.debug("Tables created");
    }

    async getRepositories() {
        return (await this._pool.query(`select * from repositories`)).rows;
    }

    async getToken(token, repo) {
        return (await this._pool.query(`select * from access_tokens where token = $1 and repo = $2`, [token, repo])).rows[0];
    }

    async getRepositoryPackages(repo) {
        return (await this._pool.query(`select * from packages where repo = $1`, [repo])).rows;
    }

    async saveRepositoryPackage(repo, name, version, payload) {
        await this._pool.query(`insert into packages (name, repo, version, payload) values ($1, $2, $3, $4)`, [name, repo, version, payload]);
    }
}