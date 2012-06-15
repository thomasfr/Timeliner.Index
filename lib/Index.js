var add = require('./commands/add');
var purge = require('./commands/purge');
var sizeOf = require('./commands/sizeOf');

var Configuration = require('configuration');
var util = require('util');
var redis = require('redis');
var EventEmitter = require('events').EventEmitter;
var emptyFn = function () {
};

/**
 * Creates a new Index with the given configuration
 * @param Object config
 * @constructor
 */
var Index = function Indexer(config) {
    "use strict";
    EventEmitter.call(this);
    var configuration = this.configuration = new Configuration(require('./defaultConfiguration.json'));
    configuration.setAll(config || {});
    if (configuration.has('redisClient')) {
        this.redisClient = configuration.get('redisClient');
    } else {
        var port = configuration.get('socket') || configuration.get('port') || null;
        var host = configuration.get('host') || null;
        var options = configuration.get('options') || null;
        this.redisClient = redis.createClient(port, host, options);
    }
};
util.inherits(Index, EventEmitter);

/**
 * Adds the given text to the index and returns the id and the amount of tokens calculated form the text
 * in the callback
 * @param String text
 * @param Function callback callback(error, {id: Number, tokens: Number})
 */
Index.prototype.add = function (text, callback) {
    "use strict";
    var redisClient = this.redisClient;
    callback = callback || emptyFn;
    if (util.isArray(text)) {
        var responses = [];
        var size = text.length;
        var i = 0;
        text.forEach(function (t) {
            add(t, redisClient, function (error, response) {
                if (error) {
                    return callback(error, null);
                } else {
                    i = i + 1;
                    responses.push(response);
                    if (i >= size) {
                        callback(null, responses);
                    }
                }
            });
        });
    } else {
        add(text, redisClient, callback);
    }
};

/**
 * Purges / Removes all indexed texts in the index.
 * It calls redis.flushdb so make sure you do not store other data besides
 * the index data on the same redis instance
 * @param Function callback
 */
Index.prototype.purge = function (callback) {
    "use strict";
    purge(this.redisClient, callback);
};

/**
 * Returns the amount of all indexed texts
 * @param Function callback
 */
Index.prototype.sizeOf = function (callback) {
    "use strict";
    sizeOf(this.redisClient, callback);
};

module.exports = Index;
