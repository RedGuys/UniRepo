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
            if (storage.exists(req.path.substring(1))) {
                let file = storage.readFile(req.path.substring(1));
                res.status(200).header("content-type","image/png").send(file);
            } else {
                //res.status(404).send("Not found");
                let reqUrl = `${url}${req.path.substring(1)}`;
                try {
                    let response = await axios.get(reqUrl,{responseType: 'arraybuffer'});
                    res.status(200);
                    let data = response.data;
                    storage.writeFile(req.path.substring(1), data);
                    res.header("content-type","image/png").send(data);
                } catch (e) {
                    res.status(404).send("Not found");
                    return;
                }
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