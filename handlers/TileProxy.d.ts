import {Access, Handler, Storage} from "../types";
import {Router} from "express";

export default class MavenProxy implements Handler {
    type: "tile-proxy";

    constructor(url: string, storage: Storage, access: Access);

    getRouter(): Router;
}