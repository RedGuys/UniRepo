const Express = require("express");
const Types = require("../types");
const Router = require('express').Router;
const XMLUtils = require('../utils/XMLUtils');
const TokenAccess = require("../access/TokenAccess");
const Database = require("../Database");

module.exports = class MavenRepo {
    /**
     * @param storage {Types.Storage}
     * @param access {Types.Access}
     */
    constructor(storage, access) {
        let router = Router();

        this.storage = storage;
        this.access = access;

        router.put("*", async (req, res, next) => {
            if (!await access.canWrite(req)) {
                res.status(403).send("Forbidden");
                return;
            }
            res.status(100);
            let buffer = [];
            req.on('data', (chunk) => {
                buffer.push(chunk);
            });
            req.on('end', async () => {
                await storage.writeFile(req.path.substring(1), Buffer.concat(buffer));
                res.status(200).send("OK");
            });
        });
        router.get("*", async (req, res, next) => {
            if (!await access.canRead(req)) {
                res.status(403).send("Forbidden");
                return;
            }
            let file = await this.getFile(req);
            if (file) {
                res.status(200);
                if(req.path.endsWith(".pom")) {
                    res.header("content-type", "application/xml");
                } else if(req.path.endsWith(".jar")) {
                    res.header("content-type", "application/java-archive");
                }
                res.send(file);
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

    async getFile(req) {
        if (this.storage.exists(req.path.substring(1))) {
            return this.storage.readFile(req.path.substring(1));
        }
        return null;
    }

    getRouter() {
        return this.router;
    }
}