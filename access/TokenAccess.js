const Database = require('../Database');

module.exports = class TokenAccess {
    constructor(name) {
        this.name = name;
    }

    async canRead(req) {
        let token = req.header("Authorization");
        if(token === undefined) {
            token = req.query.token;
            if (token === undefined) {
                return false;
            }
        }
        token = token.replace("Bearer ", "");
        let t = await Database.getInstance().getToken(token, this.name);
        return t !== undefined && t.can_read;
    }

    async canWrite(req) {
        let token = req.header("Authorization");
        if(token === undefined) {
            token = req.query.token;
            if (token === undefined) {
                return false;
            }
        }
        token = token.replace("Bearer ", "");
        let t = await Database.getInstance().getToken(token, this.name);
        return t !== undefined && t.can_write;
    }

    getActiveToken(req) {
        let token = req.header("Authorization");
        if(token === undefined) {
            token = req.query.token;
            if (token === undefined) {
                return undefined;
            }
        }
        token = token.replace("Bearer ", "");
        return token;
    }
}