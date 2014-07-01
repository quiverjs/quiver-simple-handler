"use strict";
require('traceur');
var $__0 = $traceurRuntime.assertObject(require('../lib/simple-handler.js')),
    simpleToStreamHandler = $__0.simpleToStreamHandler,
    streamToSimpleHandler = $__0.streamToSimpleHandler;
var $__0 = $traceurRuntime.assertObject(require('quiver-stream-util')),
    textToStreamable = $__0.textToStreamable,
    streamableToText = $__0.streamableToText,
    textToStream = $__0.textToStream,
    streamToText = $__0.streamToText,
    emptyStreamable = $__0.emptyStreamable;
var $__0 = $traceurRuntime.assertObject(require('quiver-promise')),
    resolve = $__0.resolve,
    reject = $__0.reject;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
describe('simple handler test', (function() {
  it('json text convert', (function() {
    var simpleHandler = (function(args, json) {
      json.content.should.equal('hello world');
      return resolve('Hello World!');
    });
    var handler = simpleToStreamHandler(simpleHandler, 'json', 'text');
    var inStream = textToStreamable('{ "content": "hello world" }');
    return handler({}, inStream).then(streamableToText).should.eventually.equal('Hello World!');
  }));
  it('void stream convert', (function() {
    var simpleHandler = (function(args, input) {
      should.not.exist(input);
      return resolve(textToStream('hello world'));
    });
    var handler = simpleToStreamHandler(simpleHandler, 'void', 'stream');
    return handler({}, emptyStreamable()).then(streamableToText).should.eventually.equal('hello world');
  }));
  it('stream void convert', (function() {
    var simpleHandler = (function(args, readStream) {
      return streamToText(readStream).then((function(text) {
        text.should.equal('hello world');
        return null;
      }));
    });
    var handler = simpleToStreamHandler(simpleHandler, 'stream', 'void');
    var inStream = textToStreamable('hello world');
    return handler({}, inStream).then(streamableToText).should.eventually.equal('');
  }));
  it('void json stream handler', (function() {
    var streamHandler = (function(args, streamable) {
      return streamableToText(streamable).then((function(text) {
        text.should.equal('');
        return textToStreamable('{ "result": "hello world" }');
      }));
    });
    var handler = streamToSimpleHandler(streamHandler, 'void', 'json');
    return handler({}).then((function(json) {
      json.result.should.equal('hello world');
    }));
  }));
  it('stream void stream handler', (function() {
    var streamHandler = (function(args, streamable) {
      return streamableToText(streamable).then((function(text) {
        text.should.equal('hello world');
        return emptyStreamable();
      }));
    });
    var handler = streamToSimpleHandler(streamHandler, 'stream', 'void');
    var inStream = textToStream('hello world');
    return handler({}, inStream).then((function(result) {
      return should.not.exist(result);
    }));
  }));
}));
