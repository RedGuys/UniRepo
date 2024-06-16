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
            route.route(req, res, next);
        } else {
            next();
        }
    }

    addRoute(path, handler) {
        this.routes.push({path, handler, route: handler.getRouter()});
    }

    removeRoute(path) {
        this.routes = this.routes.filter((route) => route.path !== path);
    }

    getHandler(path) {
        let route = this.routes.find((route) => route.path.startsWith("/"+path+"/"));
        if(route) {
            return route.handler;
        }
        return null;
    }
}