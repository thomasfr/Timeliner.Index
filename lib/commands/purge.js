/**
 *
 * @param redisClient
 * @param callback
 */
function purge(redisClient, callback) {
    "use strict";
    redisClient.flushdb(callback);
}

module.exports = purge;