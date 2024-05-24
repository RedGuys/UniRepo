import {Package, Repository, Token} from "./types";

export default class Database {

    static getInstance(): Database;

    constructor();

    createTables(): Promise<void>;

    getRepositories(): Promise<Repository[]>;

    getToken(token: string, repo: string): Promise<Token>;

    getRepositoryPackages(repo: string): Promise<Package[]>;

    saveRepositoryPackage(repo: string, name: string, version: string, payload: {[key: string]: string}): Promise<void>;
}