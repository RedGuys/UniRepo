import {Access, Handler, Storage} from "../types";
import {Express, Router} from "express";
import * as Buffer from "node:buffer";

export default class MavenRepo implements Handler {
    type: "maven";

    constructor(storage: Storage, access: Access);

    getRouter(): Router;

    getFile(req: Express.Request): Promise<Buffer | null>;
}