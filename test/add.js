var Index = require('../index');
var should = require('should');

var dummyText = "This is a dummy text with multiple different words. Each word gets added to a fresh and empied index.";

describe('#add', function () {
    "use strict";
    var index = Index.createClient();
    beforeEach(function () {
        index.purge();
    });
    it('should index the given text without errors', function (done) {
        index.add("foo bar", function (error, response) {
            should.not.exist(error);
            done();
        });
    });
    it('should return response with id and amount of added tokens without errors', function (done) {
        index.add(dummyText, function (error, response) {
            should.not.exist(error);
            response.should.have.property('id');
            response.should.have.property('tokens');
            done();
        });
    });
    it('should return a response with the correct id and the correct amount of tokens', function (done) {
        index.add(dummyText, function (error, response) {
            should.not.exist(error);
            console.log("id: ", response.id, "tokens: ", response.tokens);
            response.id.should.equal(1);
            response.tokens.should.equal(26);
            done();
        });
    });
    it('should return multiple texts at once without errors', function (done) {
        index.add([dummyText, dummyText, dummyText, dummyText], function (error, responses) {
            responses.should.be.an.instanceOf(Array).and.have.lengthOf(4);
            var id = 1;
            responses.forEach(function (response) {
                response.should.be.an.instanceOf(Object);
                response.id.should.equal(id);
                response.tokens.should.equal(26);
                id = id + 1;
            });
            done();
        });
    });
    it('should be possible to pass different options to the createClient call', function (done) {
        var client = Index.createClient({
            host: "127.0.0.1",
            port: 6379
        });
        client.add(dummyText, function (error, response) {
            should.not.exist(error);
            done();
        });
    });
    it('should be possible to pass socket option to the createClient call', function (done) {
        var client = Index.createClient({
            port: __dirname + "/redis.sock"
        });
        client.add(dummyText, function (error, response) {
            should.not.exist(error);
            done();
        });
    });
});