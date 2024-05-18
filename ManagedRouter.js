module.exports = class ManagedRouter {
    constructor() {
        this.routes = [];
    }

    async process(req, res, next) {
        let route = this.routes.find((route) => req.path.startsWith(route.path));
        if(route) {
            let length = route.path.length;
            if(route.path.endsWith("/")) length--;
            req.url = req.url.substring(length);
            route.handler(req, res, next);
        } else {
            next();
        }
    }

    addRoute(path, handler) {
        this.routes.push({path, handler});
    }

    removeRoute(path) {
        this.routes = this.routes.filter((route) => route.path !== path);
    }
}