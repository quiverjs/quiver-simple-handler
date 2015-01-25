"use strict";
var $__traceur_64_0_46_0_46_8__,
    $__quiver_45_promise__,
    $___46__46__47_lib_47_simple_45_handler_46_js__,
    $__quiver_45_stream_45_util__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_8__ = require("traceur"), $__traceur_64_0_46_0_46_8__ && $__traceur_64_0_46_0_46_8__.__esModule && $__traceur_64_0_46_0_46_8__ || {default: $__traceur_64_0_46_0_46_8__});
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var $__1 = ($___46__46__47_lib_47_simple_45_handler_46_js__ = require("../lib/simple-handler.js"), $___46__46__47_lib_47_simple_45_handler_46_js__ && $___46__46__47_lib_47_simple_45_handler_46_js__.__esModule && $___46__46__47_lib_47_simple_45_handler_46_js__ || {default: $___46__46__47_lib_47_simple_45_handler_46_js__}),
    simpleToStreamHandler = $__1.simpleToStreamHandler,
    streamToSimpleHandler = $__1.streamToSimpleHandler;
var $__2 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    textToStreamable = $__2.textToStreamable,
    streamableToText = $__2.streamableToText,
    textToStream = $__2.textToStream,
    streamToText = $__2.streamToText,
    emptyStreamable = $__2.emptyStreamable;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
let should = chai.should();
describe('simple handler test', (function() {
  it('json text convert', (function() {
    let simpleHandler = (function(args, json) {
      json.content.should.equal('hello world');
      return 'Hello World!';
    });
    let handler = simpleToStreamHandler(simpleHandler, 'json', 'text');
    let inStream = textToStreamable('{ "content": "hello world" }');
    return handler({}, inStream).then(streamableToText).should.eventually.equal('Hello World!');
  }));
  it('void stream convert', (function() {
    let simpleHandler = (function(args, input) {
      should.not.exist(input);
      return textToStream('hello world');
    });
    let handler = simpleToStreamHandler(simpleHandler, 'void', 'stream');
    return handler({}, emptyStreamable()).then(streamableToText).should.eventually.equal('hello world');
  }));
  it('void html convert', async(function*() {
    let html = '<b>Hello World</b>';
    let simpleHandler = (function(args) {
      return html;
    });
    let handler = simpleToStreamHandler(simpleHandler, 'void', 'html');
    let resultStreamable = yield handler({}, emptyStreamable());
    resultStreamable.contentType.should.equal('text/html');
    yield streamableToText(resultStreamable).should.eventually.equal(html);
  }));
  it('stream void convert', (function() {
    let simpleHandler = (function(args, readStream) {
      return streamToText(readStream).then((function(text) {
        text.should.equal('hello world');
        return null;
      }));
    });
    let handler = simpleToStreamHandler(simpleHandler, 'stream', 'void');
    let inStream = textToStreamable('hello world');
    return handler({}, inStream).then(streamableToText).should.eventually.equal('');
  }));
  it('void json stream handler', (function() {
    let streamHandler = (function(args, streamable) {
      return streamableToText(streamable).then((function(text) {
        text.should.equal('');
        return textToStreamable('{ "result": "hello world" }');
      }));
    });
    let handler = streamToSimpleHandler(streamHandler, 'void', 'json');
    return handler({}).then((function(json) {
      json.result.should.equal('hello world');
    }));
  }));
  it('stream void stream handler', (function() {
    let streamHandler = (function(args, streamable) {
      return streamableToText(streamable).then((function(text) {
        text.should.equal('hello world');
        return emptyStreamable();
      }));
    });
    let handler = streamToSimpleHandler(streamHandler, 'stream', 'void');
    let inStream = textToStream('hello world');
    return handler({}, inStream).then((function(result) {
      return should.not.exist(result);
    }));
  }));
}));
