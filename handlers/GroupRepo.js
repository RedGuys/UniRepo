const Types = require("../types");
const Router = require('express').Router;
const axios = require("axios");

module.exports = class MavenRepo {
    /**
     *
     * @param managedRouter {ManagedRouter}
     * @param repos {string[]}
     * @param storage {Types.Storage}
     * @param access {Types.Access}
     */
    constructor(managedRouter, repos, storage, access) {
        let router = Router();

        this.managedRouter = managedRouter;
        this.repos = repos;
        this.storage = storage;
        this.access = access;

        router.put("*", async (req, res, next) => {
            res.status(405).send("Method Not Allowed")
        });

        router.post("*", async (req, res, next) => {
            res.status(405).send("Method Not Allowed")
        });
        router.get("*", async (req, res, next) => {
            if (!await access.canRead(req)) {
                res.status(403).send("Forbidden");
                return;
            }
            let file = await this.getFile(req);
            if (file) {
                res.status(200).send(file);
            } else {
                res.status(404).send("Not found");
            }
        });
        router.delete("*", async (req, res, next) => {
            res.status(405).send("Method Not Allowed")
        });

        this.router = router;
    }

    async getFile(req) {
        for (let repo of this.repos) {
            let handler = this.managedRouter.getHandler(repo);
            if (handler) {
                let file = await handler.getFile(req);
                if (file) {
                    return file;
                }
            }
        }
        return null;
    }

    getRouter() {
        return this.router;
    }
}