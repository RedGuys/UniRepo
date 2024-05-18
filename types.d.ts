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
}

export class Access {
    type: string;

    canWrite(req: Express.Request): Promise<boolean>;
    canRead(req: Express.Request): Promise<boolean>;
}