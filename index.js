var Index = require('./lib/Index');
module.exports = {
    createClient: function (config) {
        "use strict";
        return new Index(config);
    }
};
