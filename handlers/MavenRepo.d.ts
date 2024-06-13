import {Access, Handler, Storage} from "../types";
import {Router} from "express";

export default class MavenRepo implements Handler {
    type: "maven";

    constructor(name: string, storage: Storage, access: Access);

    getRouter(): Router;
}