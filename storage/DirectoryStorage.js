const fs = require('fs');
const Path = require('path');

module.exports = class DirectoryStorage {
    constructor(path) {
        this.path = path;
        fs.mkdirSync(path, {recursive: true});
    }

    writeFile(path, data) {
        fs.mkdirSync(Path.dirname(Path.resolve(this.path, path)), {recursive: true});
        fs.writeFileSync(Path.resolve(this.path, path), data);
    }

    readFile(path) {
        return fs.readFileSync(Path.resolve(this.path, path));
    }

    exists(path) {
        return fs.existsSync(Path.resolve(this.path, path));
    }

    deleteFile(path) {
        fs.unlinkSync(Path.resolve(this.path, path));
    }
}