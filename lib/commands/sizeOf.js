/**
 *
 * @param redisClient
 * @param callback
 */
function sizeOf(redisClient, callback) {
    "use strict";
    redisClient.llen('DOCUMENTS', callback);
}

module.exports = sizeOf;