import {Express, Router} from "express";

export class Repository {
    id: string;
    name: string;
    storage: Storage;
    status: Status;
    handler: Handler;
    access: Access;
}

export class Storage {
    type: string;

    writeFile(path: string, data: string | NodeJS.ArrayBufferView): void;
    readFile(path: string): Buffer;
    exists(path: string): boolean;
    deleteFile(path: string): void;
}

export type Status = "active" | "disabled";

export class Handler {
    type: string;

    getRouter(): Router;
    getFile(req: Express.Request): Promise<Buffer | null>;
}

export class Access {
    type: string;

    canWrite(req: Express.Request): Promise<boolean>;
    canRead(req: Express.Request): Promise<boolean>;
}

export class Token {
    id: string;
    token: string;
    repo: string;
    can_read: boolean;
    can_write: boolean;
}

export class Package {
    id: string;
    name: string;
    repo: string;
    version: string;
    payload: {[key: string]: any};
}