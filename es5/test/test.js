"use strict";
var $__traceur_64_0_46_0_46_7__,
    $__quiver_45_promise__,
    $___46__46__47_lib_47_simple_45_handler_46_js__,
    $__quiver_45_stream_45_util__;
($__traceur_64_0_46_0_46_7__ = require("traceur"), $__traceur_64_0_46_0_46_7__ && $__traceur_64_0_46_0_46_7__.__esModule && $__traceur_64_0_46_0_46_7__ || {default: $__traceur_64_0_46_0_46_7__});
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
  it('void html convert', async($traceurRuntime.initGeneratorFunction(function $__3() {
    var html,
        simpleHandler,
        handler,
        resultStreamable;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            html = '<b>Hello World</b>';
            simpleHandler = (function(args) {
              return html;
            });
            handler = simpleToStreamHandler(simpleHandler, 'void', 'html');
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 2;
            return handler({}, emptyStreamable());
          case 2:
            resultStreamable = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            resultStreamable.contentType.should.equal('text/html');
            $ctx.state = 12;
            break;
          case 12:
            $ctx.state = 6;
            return streamableToText(resultStreamable).should.eventually.equal(html);
          case 6:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__3, this);
  })));
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
