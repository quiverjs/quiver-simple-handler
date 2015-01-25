"use strict";
Object.defineProperties(exports, {
  simpleToStreamHandler: {get: function() {
      return simpleToStreamHandler;
    }},
  streamToSimpleHandler: {get: function() {
      return streamToSimpleHandler;
    }},
  validateSimpleTypes: {get: function() {
      return validateSimpleTypes;
    }},
  __esModule: {value: true}
});
var $__quiver_45_stream_45_util__,
    $__quiver_45_error__,
    $__quiver_45_promise__;
var $__0 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    streamableToText = $__0.streamableToText,
    streamableToJson = $__0.streamableToJson,
    textToStreamable = $__0.textToStreamable,
    jsonToStreamable = $__0.jsonToStreamable,
    streamToStreamable = $__0.streamToStreamable,
    emptyStreamable = $__0.emptyStreamable;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var $__2 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    resolve = $__2.resolve,
    reject = $__2.reject,
    safePromised = $__2.safePromised;
let convertHandler = (function(handler, inConvert, outConvert) {
  return (function(args, input) {
    return resolve(inConvert(input)).then((function(input) {
      return handler(args, input).then((function(result) {
        return outConvert(result);
      }));
    }));
  });
});
let streamableToVoid = (function(streamable) {
  if (streamable.reusable)
    return resolve();
  return streamable.toStream().then((function(readStream) {
    return readStream.closeRead();
  }));
});
let voidToStreamable = (function() {
  return resolve(emptyStreamable());
});
let streamableToStream = (function(streamable) {
  return streamable.toStream();
});
let streamableToStreamable = (function(streamable) {
  return resolve(streamable);
});
let htmlToStreamable = (function(text) {
  return textToStreamable(text, 'text/html');
});
let streamToSimpleTable = {
  'void': streamableToVoid,
  'text': streamableToText,
  'string': streamableToText,
  'html': streamableToText,
  'json': streamableToJson,
  'stream': streamableToStream,
  'streamable': streamableToStreamable
};
let simpleToStreamTable = {
  'void': voidToStreamable,
  'text': textToStreamable,
  'string': textToStreamable,
  'html': htmlToStreamable,
  'json': jsonToStreamable,
  'stream': streamToStreamable,
  'streamable': streamableToStreamable
};
let createConverter = (function(inTable, outTable) {
  return (function(handler, inType, outType) {
    let inConvert = inTable[inType];
    if (!inConvert)
      throw new Error('invalid simple type ' + inType);
    let outConvert = outTable[outType];
    if (!outConvert)
      throw new Error('invalid simple type ' + outType);
    return convertHandler(safePromised(handler), inConvert, outConvert);
  });
});
let simpleToStreamHandler = createConverter(streamToSimpleTable, simpleToStreamTable);
let streamToSimpleHandler = createConverter(simpleToStreamTable, streamToSimpleTable);
let validateSimpleTypes = (function(types) {
  for (var $__3 = types[$traceurRuntime.toProperty(Symbol.iterator)](),
      $__4; !($__4 = $__3.next()).done; ) {
    let type = $__4.value;
    {
      if (!streamToSimpleTable[type]) {
        return new Error('invalid simple type ' + type);
      }
    }
  }
});
