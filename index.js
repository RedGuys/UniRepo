const Express = require("express");
const Morgan = require("morgan");
const JetBrainsPlugin = require("./handlers/JetBrainsPlugin")
const MavenRepo = require("./handlers/MavenRepo");
const MavenProxy = require("./handlers/MavenProxy");
const TileProxy = require("./handlers/TileProxy");
const GroupRepo = require("./handlers/GroupRepo");
const DirectoryStorage = require("./storage/DirectoryStorage");
const ManagedRouter = require("./ManagedRouter");
const Database = require("./Database");
const Log4js = require("log4js");
const PublicAccess = require("./access/PublicAccess");
const TokenAccess = require("./access/TokenAccess");
const AnonymousReadAccess = require("./access/AnonymousReadAccess");
const BasicAccess = require("./access/BasicAccess");
const logger = Log4js.getLogger("Main");
const JetBrainsHubAccess = require("./access/JetbrainsHubAccess");

Log4js.configure({
    appenders: {
        std: {type: "stdout"}
    },
    categories: {
        default: {
            appenders: ["std"],
            level: process.env.VERBOSE ? "debug" : "info"
        }
    }
});

function getStorage(storage) {
    switch (storage.type) {
        case "directory":
            return new DirectoryStorage(storage.path);
        case "disabled":
            return null;
        default:
            logger.error(`Unknown storage type: ${storage.type}`);
    }
}

function getHandler(handler, adds, storage, access) {
    switch (handler.type) {
        case "jetbrains":
            return new JetBrainsPlugin(adds.name, storage, access);
        case "maven":
            return new MavenRepo(storage, access);
        case "maven-proxy":
            return new MavenProxy(handler.url, storage, access);
        case "tile-proxy":
            return new TileProxy(handler.url, storage, access);
        case "group":
            return new GroupRepo(adds.managedRouter, handler.repos, storage, access);
        default:
            logger.error(`Unknown handler type: ${handler.type}`);
    }
}

function getAccess(access) {
    switch (access.type) {
        case "public":
            return new PublicAccess();
        case "token":
            return new TokenAccess(access.name);
        case "anonymous":
            return new AnonymousReadAccess(getAccess(access.access));
        case "basic":
            return new BasicAccess(access.name);
        case "jetbrains":
            return new JetBrainsHubAccess(access.url, access.group);
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
    app.use("/repo/", managedRouter.process.bind(managedRouter));

    let repositories = await db.getRepositories();
    repositories.forEach((repo) => {
        if (repo.status !== "active") return;
        logger.debug(`Starting repo: ${repo.name}`);
        let storage = getStorage(repo.storage);
        let access = getAccess(repo.access);
        let handler = getHandler(repo.handler, {name: repo.name, managedRouter}, storage, access);
        managedRouter.addRoute(`/${repo.name}/`, handler);
    });

    app.listen(process.env.PORT || 3000, () => {
        logger.info("Server is running on port " + (process.env.PORT || 3000));
    });
})();