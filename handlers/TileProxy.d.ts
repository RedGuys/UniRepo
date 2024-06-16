import {Access, Handler, Storage} from "../types";
import {Express, Router} from "express";
import * as Buffer from "node:buffer";

export default class MavenProxy implements Handler {
    type: "tile-proxy";

    constructor(url: string, storage: Storage, access: Access);

    getRouter(): Router;

    getFile(req: Express.Request): Promise<Buffer | null>;
}