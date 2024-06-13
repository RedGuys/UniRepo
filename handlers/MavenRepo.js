const Express = require("express");
const Types = require("../types");
const Router = require('express').Router;
const XMLUtils = require('../utils/XMLUtils');
const TokenAccess = require("../access/TokenAccess");
const Database = require("../Database");

module.exports = class MavenRepo {
    /**
     *
     * @param name {string}
     * @param storage {Types.Storage}
     * @param access {Types.Access}
     */
    constructor(name, storage, access) {
        let router = Router();

        router.put("*", async (req, res, next) => {
            if (!await access.canWrite(req)) {
                res.status(403).send("Forbidden");
                return;
            }
            res.status(100)
            storage.writeFile(req.path.substring(1), req.read(req.readableLength));
            res.status(200).send("OK");
        });
        router.get("*", async (req, res, next) => {
            if (!await access.canRead(req)) {
                res.status(403).send("Forbidden");
                return;
            }
            if (storage.exists(req.path.substring(1))) {
                let file = storage.readFile(req.path.substring(1));
                res.status(200).send(file);
            } else {
                res.status(404).send("Not found");
            }
        });
        router.delete("*", async (req, res, next) => {
            if (!await access.canWrite(req)) {
                res.status(403).send("Forbidden");
                return;
            }
            if (storage.exists(req.path.substring(1))) {
                storage.deleteFile(req.path.substring(1));
                res.status(200).send("OK");
            } else {
                res.status(404).send("Not found");
            }
        });

        this.router = router;
    }

    getRouter() {
        return this.router;
    }
}