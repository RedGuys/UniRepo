const Express = require("express");
const Types = require("../types");
const Router = require('express').Router;

module.exports = class JetBrainsPlugin {
    /**
     *
     * @param storage {Types.Storage}
     * @param access {Types.Access}
     */
    constructor(storage, access) {
        let router = Router();

        router.use(Express.raw({ type: "*/*", limit: Number.POSITIVE_INFINITY}));
        router.post("*", (req, res, next) => {
            if(!access.canWrite(req)) {
                res.status(403).send("Forbidden");
                return;
            }
            if(req.body.length > 0) {
                storage.writeFile(req.path.substring(1), req.body);
                res.status(200).send("OK");
            } else {
                res.status(400).send("Bad request");
            }
        });
        router.get("*", (req, res, next) => {
            if(!access.canRead(req)) {
                res.status(403).send("Forbidden");
                return;
            }
            if(storage.exists(req.path.substring(1))) {
                res.status(200).send(storage.readFile(req.path.substring(1)));
            } else {
                res.status(404).send("Not found");
            }
        });
        router.delete("*", (req, res, next) => {
            if(!access.canWrite(req)) {
                res.status(403).send("Forbidden");
                return;
            }
            if(storage.exists(req.path.substring(1))) {
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