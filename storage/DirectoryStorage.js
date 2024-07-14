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
        if(fs.existsSync(Path.resolve(this.path, path + ".umeta"))) {
            let metadata = this.readMetadata(path);
            metadata.lastModified = Math.floor(Date.now() / 1000);
            this.writeMetadata(path, metadata);
        } else {
            this.writeMetadata(path, {
                lastModified: Math.floor(Date.now() / 1000),
                lastAccessed: Math.floor(Date.now() / 1000),
                created: Math.floor(Date.now() / 1000)
            });
        }
    }

    readFile(path) {
        let metadata = this.readMetadata(path);
        metadata.lastAccessed = Math.floor(Date.now() / 1000);
        this.writeMetadata(path, metadata);
        return fs.readFileSync(Path.resolve(this.path, path));
    }

    exists(path) {
        if(path.endsWith(".umeta")) return false;
        return fs.existsSync(Path.resolve(this.path, path));
    }

    deleteFile(path) {
        if(fs.existsSync(Path.resolve(this.path, path + ".umeta"))){
            fs.unlinkSync(Path.resolve(this.path, path + ".umeta"));
        }
        fs.unlinkSync(Path.resolve(this.path, path));
    }

    readMetadata(path) {
        if(!fs.existsSync(Path.resolve(this.path, path + ".umeta"))) return {};
        let data = fs.readFileSync(Path.resolve(this.path, path + ".umeta"));
        return JSON.parse(data.toString());
    }

    writeMetadata(path, metadata) {
        fs.writeFileSync(Path.resolve(this.path, path + ".umeta"), JSON.stringify(metadata));
    }
}