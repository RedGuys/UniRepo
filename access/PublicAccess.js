module.exports = class PublicAccess {
    constructor() {
    }

    async canRead() {
        return true;
    }

    async canWrite() {
        return true;
    }
}