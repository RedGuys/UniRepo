import {Access, Handler, Storage} from "../types";
import {Router} from "express";

export default class JetBrainsPlugin implements Handler {
    type: "jetbrains";

    constructor(name: string, storage: Storage, access: Access);

    getRouter(): Router;
}