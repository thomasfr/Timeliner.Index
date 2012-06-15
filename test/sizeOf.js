var should = require('should');
var Index = require('../index');

describe('#sizeOf()', function () {
    var index = Index.createClient();
    before(function () {
        index.purge();
    });
    it('should have an initial size of 0', function (done) {
        index.sizeOf(function (error, size) {
            should.not.exist(error);
            done();
        });
    });
    it('should return the correct length after adding to the index', function (done) {
        index.add(["foo bar", "lorem ipsum", "hudri wudri schludri"], function (error) {
            should.not.exist(error);
            index.sizeOf(function (error, size) {
                should.not.exist(error);
                console.log("size:", size);
                size.should.be.equal(3);
                done();
            });
        });
    });
});