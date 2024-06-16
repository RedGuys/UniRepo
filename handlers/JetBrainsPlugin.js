const Express = require("express");
const Types = require("../types");
const Router = require('express').Router;
const XMLUtils = require('../utils/XMLUtils');
const TokenAccess = require("../access/TokenAccess");
const Database = require("../Database");

module.exports = class JetBrainsPlugin {
    /**
     *
     * @param name {string}
     * @param storage {Types.Storage}
     * @param access {Types.Access}
     */
    constructor(name, storage, access) {
        let router = Router();

        this.name = name;
        this.storage = storage;
        this.access = access;

        router.use(Express.raw({type: "*/*", limit: Number.POSITIVE_INFINITY}));
        router.post("*", async (req, res, next) => {
            if (!await access.canWrite(req)) {
                res.status(403).send("Forbidden");
                return;
            }
            if(req.path === "/updatePlugins.xml") {
                let xml = await XMLUtils.parseString(req.body.toString());
                let remotePackages = xml.plugins.plugin;
                let localPackages = await Database.getInstance().getRepositoryPackages(name);
                // Find new packages by comparing id and version
                let newPackages = remotePackages.filter(rp => !localPackages.some(lp => lp.name === rp.$.id && lp.version === rp.$.version));
                for (let newPackage of newPackages) {
                    let payload = {
                        name: newPackage.name,
                        description: newPackage.description,
                        url: newPackage.$.url
                    };
                    await Database.getInstance().saveRepositoryPackage(name, newPackage.$.id, newPackage.$.version, payload);
                }
                res.status(200).send("OK");
                return;
            }
            if (req.body.length > 0) {
                storage.writeFile(req.path.substring(1), req.body);
                res.status(200).send("OK");
            } else {
                res.status(400).send("Bad request");
            }
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
        if (req.path === "/updatePlugins.xml") {
            let packages = await Database.getInstance().getRepositoryPackages(this.name);
            let xml = {plugins: {plugin: []}};
            for (let pack of packages) {
                let url = pack.payload.url;
                if(this.access instanceof TokenAccess) {
                    url += `?token=${this.access.getActiveToken(req)}`;
                }
                xml.plugins.plugin.push({
                    '$': {
                        id: pack.name,
                        url: url,
                        version: pack.version
                    },
                    description: pack.payload.description,
                    name: pack.payload.name
                });
            }
            return await XMLUtils.buildObject(xml);
        }
        if (this.storage.exists(req.path.substring(1))) {
            return this.storage.readFile(req.path.substring(1));
        } else {
            return null;
        }
    }

    getRouter() {
        return this.router;
    }
}