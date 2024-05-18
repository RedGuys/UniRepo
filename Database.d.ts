import {Repository} from "./types";

export default class Database {
    constructor();

    createTables(): Promise<void>;

    getRepositories(): Promise<Repository[]>;
}