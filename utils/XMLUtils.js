const xml2js = require('xml2js');

module.exports = class XMLUtils {
    static parseString(xml) {
        return new Promise((resolve, reject) => {
            xml2js.parseString(xml, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static buildObject(obj) {
        return new Promise((resolve, reject) => {
            let builder = new xml2js.Builder();
            resolve(builder.buildObject(obj));
        });
    }
}