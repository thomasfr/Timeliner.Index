var Core = require('Timeliner.Core');
var fs = require('fs');
var indexScript = fs.readFileSync(__dirname + '/addTokens.lua', 'utf8');

/**
 *
 * @param String
 * @param client
 * @param callback
 * @return {*}
 */
function index(text, client, callback) {
    "use strict";

    if (!text || text.length <= 0) {
        return callback("invalid document", null);
    }

    Core.tokenizeText(text, function (error, keys) {
        client.eval(indexScript, 1, "tokens", JSON.stringify(keys), function (err, response) {
            if (err) {
                callback(new Error(err), null);
            } else {
                process.nextTick(function () {
                    callback(null, {
                        id: response[0],
                        tokens: response[1]
                    });
                });
            }
        });
    });
}

module.exports = index;