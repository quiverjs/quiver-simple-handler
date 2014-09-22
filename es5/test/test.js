"use strict";
var $__traceur_64_0_46_0_46_6__,
    $___46__46__47_lib_47_simple_45_handler_46_js__,
    $__quiver_45_stream_45_util__;
($__traceur_64_0_46_0_46_6__ = require("traceur"), $__traceur_64_0_46_0_46_6__ && $__traceur_64_0_46_0_46_6__.__esModule && $__traceur_64_0_46_0_46_6__ || {default: $__traceur_64_0_46_0_46_6__});
var $__0 = ($___46__46__47_lib_47_simple_45_handler_46_js__ = require("../lib/simple-handler.js"), $___46__46__47_lib_47_simple_45_handler_46_js__ && $___46__46__47_lib_47_simple_45_handler_46_js__.__esModule && $___46__46__47_lib_47_simple_45_handler_46_js__ || {default: $___46__46__47_lib_47_simple_45_handler_46_js__}),
    simpleToStreamHandler = $__0.simpleToStreamHandler,
    streamToSimpleHandler = $__0.streamToSimpleHandler;
var $__1 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    textToStreamable = $__1.textToStreamable,
    streamableToText = $__1.streamableToText,
    textToStream = $__1.textToStream,
    streamToText = $__1.streamToText,
    emptyStreamable = $__1.emptyStreamable;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
describe('simple handler test', (function() {
  it('json text convert', (function() {
    var simpleHandler = (function(args, json) {
      json.content.should.equal('hello world');
      return 'Hello World!';
    });
    var handler = simpleToStreamHandler(simpleHandler, 'json', 'text');
    var inStream = textToStreamable('{ "content": "hello world" }');
    return handler({}, inStream).then(streamableToText).should.eventually.equal('Hello World!');
  }));
  it('void stream convert', (function() {
    var simpleHandler = (function(args, input) {
      should.not.exist(input);
      return textToStream('hello world');
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
