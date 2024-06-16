const Express = require("express");
const Types = require("../types");
const Router = require('express').Router;
const XMLUtils = require('../utils/XMLUtils');
const TokenAccess = require("../access/TokenAccess");
const Database = require("../Database");
const axios = require("axios");

module.exports = class MavenRepo {
    /**
     *
     * @param url {string}
     * @param storage {Types.Storage}
     * @param access {Types.Access}
     */
    constructor(url, storage, access) {
        if(!url.endsWith("/")) {
            url += "/";
        }
        let router = Router();

        this.url = url;
        this.storage = storage;
        this.access = access;

        router.put("*", async (req, res, next) => {
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
        } else {
            let reqUrl = `${this.url}${req.path.substring(1)}`;
            try {
                let response = await axios.get(reqUrl);
                let data = response.data;
                this.storage.writeFile(req.path.substring(1), data);
                return data;
            } catch (e) {
                return null;
            }
        }
    }

    getRouter() {
        return this.router;
    }
}