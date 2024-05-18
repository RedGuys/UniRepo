const Express = require("express");
const Morgan = require("morgan");
const JetBrainsPlugin = require("./handlers/JetBrainsPlugin")
const DirectoryStorage = require("./storage/DirectoryStorage");
const ManagedRouter = require("./ManagedRouter");
const Database = require("./Database");
const Log4js = require("log4js");
const PublicAccess = require("./access/PublicAccess");
const logger = Log4js.getLogger("Main");

Log4js.configure({
    appenders: {
        std: {type: "stdout"}
    },
    categories: {
        default: {
            appenders: ["std"],
            level: process.env.VERBOSE?"debug":"info"
        }
    }
});

function getStorage(storage) {
    switch (storage.type) {
        case "directory":
            return new DirectoryStorage(storage.path);
        default:
            logger.error(`Unknown storage type: ${storage.type}`);
    }
}

function getHandler(handler, storage, access) {
    switch (handler.type) {
        case "jetbrains":
            return new JetBrainsPlugin(storage, access);
        default:
            logger.error(`Unknown handler type: ${handler.type}`);
    }
}

function getAccess(access) {
    switch (access.type) {
        case "public":
            return new PublicAccess();
        default:
            logger.error(`Unknown access type: ${access.type}`);
    }
}

(async () => {
    logger.info("Starting the server");
    let app = Express();
    let db = new Database();
    app.use(Morgan("dev"));

    logger.log("Init Database");
    await db.createTables();

    logger.log("Init routes");
    let managedRouter = new ManagedRouter();
    app.use(managedRouter.process.bind(managedRouter));

    let repositories = await db.getRepositories();
    repositories.forEach((repo) => {
        if(repo.status !== "active") return;
        logger.debug(`Starting repo: ${repo.name}`);
        let storage = getStorage(repo.storage);
        let access = getAccess(repo.access);
        let handler = getHandler(repo.handler, storage, access);
        managedRouter.addRoute(`/${repo.name}/`, handler.getRouter());
    });

    app.listen(3000, () => {
        logger.info("Server is running on port 3000");
    });
})();