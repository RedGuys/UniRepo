const Cache = require('rgcache');
const axios = require("axios");

module.exports = class TokenAccess {
    cache = new Cache.MemoryCache({
        ttl: 60000, loader: async (key) => {
            try {
                let user = await axios.get(this.url + "/api/rest/users/me", {
                    headers: {
                        Authorization: `Bearer ${key}`
                    }
                });
                let globalRole = user.data.groups.find(r => r.id === this.group);
                return globalRole !== null;
            } catch (e) {
                return false;
            }
        }, thisArg: this
    })

    constructor(url, group) {
        this.url = url;
        this.group = group;
    }

    async canRead(req) {
        return await this.cache.get(this.getActiveToken(req));
    }

    async canWrite(req) {
        return await this.cache.get(this.getActiveToken(req));
    }

    getActiveToken(req) {
        let token = req.header("Authorization");
        if (token === undefined) {
            token = req.query.token;
            if (token === undefined) {
                return undefined;
            }
        }
        token = token.replace("Bearer ", "");
        return token;
    }
}