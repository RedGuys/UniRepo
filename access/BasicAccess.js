const Database = require('../Database');

module.exports = class Basic {
    constructor(name) {
        this.name = name;
    }

    async canRead(req) {
        let token = this.getActiveToken(req);
        let t = await Database.getInstance().getToken(token, this.name);
        return t !== undefined && t.can_read;
    }

    async canWrite(req) {
        let token = this.getActiveToken(req);
        let t = await Database.getInstance().getToken(token, this.name);
        return t !== undefined && t.can_write;
    }

    getActiveToken(req) {
        let token = req.header("Authorization");
        if (token === undefined) {
            return null;
        }
        token = token.replace("Basic ", "");
        token = Buffer.from(token, 'base64').toString();
        return token;
    }
}