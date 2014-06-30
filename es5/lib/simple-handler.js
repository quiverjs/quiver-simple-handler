"use strict";
Object.defineProperties(exports, {
  simpleToStreamHandler: {get: function() {
      return simpleToStreamHandler;
    }},
  streamToSimpleHandler: {get: function() {
      return streamToSimpleHandler;
    }},
  __esModule: {value: true}
});
var $__0 = $traceurRuntime.assertObject(require('quiver-stream-util')),
    streamableToText = $__0.streamableToText,
    streamableToJson = $__0.streamableToJson,
    textToStreamable = $__0.textToStreamable,
    jsonToStreamable = $__0.jsonToStreamable,
    streamToStreamable = $__0.streamToStreamable,
    emptyStreamable = $__0.emptyStreamable;
var error = $traceurRuntime.assertObject(require('quiver-error')).error;
var $__0 = $traceurRuntime.assertObject(require('quiver-promise')),
    resolve = $__0.resolve,
    reject = $__0.reject;
var convertHandler = (function(handler, inConvert, outConvert) {
  return (function(args, input) {
    return inConvert(input).then((function(input) {
      return handler(args, input).then((function(result) {
        return outConvert(result);
      }));
    }));
  });
});
var streamableToVoid = (function(streamable) {
  if (streamable.reusable)
    return resolve();
  return streamable.toStream().then((function(readStream) {
    return readStream.closeRead();
  }));
});
var voidToStreamable = (function() {
  return resolve(emptyStreamable());
});
var readStreamToStreamable = (function(stream) {
  return resolve(streamToStreamable(stream));
});
var streamableToStream = (function(streamable) {
  return streamable.toStream();
});
var streamableToStreamable = (function(streamable) {
  return resolve(streamable);
});
var streamToSimpleTable = {
  'void': streamableToVoid,
  'text': streamableToText,
  'json': streamableToJson,
  'stream': streamableToStream,
  'streamable': streamableToStreamable
};
var simpleToStreamTable = {
  'void': voidToStreamable,
  'text': textToStreamable,
  'json': jsonToStreamable,
  'stream': readStreamToStreamable,
  'streamable': streamableToStreamable
};
var createConverter = (function(inTable, outTable) {
  return (function(handler, inType, outType) {
    var inConvert = inTable[inType];
    if (!inConvert)
      throw new Error('invalid simple type ' + inType);
    var outConvert = outTable[outType];
    if (!outConvert)
      throw new Error('invalid simple type ' + outType);
    return convertHandler(handler, inConvert, outConvert);
  });
});
var simpleToStreamHandler = createConverter(streamToSimpleTable, simpleToStreamTable);
var streamToSimpleHandler = createConverter(simpleToStreamTable, streamToSimpleTable);
