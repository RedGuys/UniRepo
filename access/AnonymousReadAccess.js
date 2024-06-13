module.exports = class PublicAccess {
    constructor(access) {
        this.access = access;
    }

    async canRead() {
        return true;
    }

    async canWrite(req) {
        return await this.access.canWrite(req);
    }
}