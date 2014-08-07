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
var $__2 = $traceurRuntime.assertObject(require('quiver-stream-util')),
    streamableToText = $__2.streamableToText,
    streamableToJson = $__2.streamableToJson,
    textToStreamable = $__2.textToStreamable,
    jsonToStreamable = $__2.jsonToStreamable,
    streamToStreamable = $__2.streamToStreamable,
    emptyStreamable = $__2.emptyStreamable;
var error = $traceurRuntime.assertObject(require('quiver-error')).error;
var $__2 = $traceurRuntime.assertObject(require('quiver-promise')),
    resolve = $__2.resolve,
    reject = $__2.reject,
    safePromised = $__2.safePromised;
var convertHandler = (function(handler, inConvert, outConvert) {
  return (function(args, input) {
    return resolve(inConvert(input)).then((function(input) {
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
  'stream': streamToStreamable,
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
    return convertHandler(safePromised(handler), inConvert, outConvert);
  });
});
var simpleToStreamHandler = createConverter(streamToSimpleTable, simpleToStreamTable);
var streamToSimpleHandler = createConverter(simpleToStreamTable, streamToSimpleTable);
var validateSimpleTypes = (function(types) {
  for (var $__0 = types[Symbol.iterator](),
      $__1; !($__1 = $__0.next()).done; ) {
    var type = $__1.value;
    {
      if (!streamToSimpleTable[type]) {
        return new Error('invalid simple type ' + type);
      }
    }
  }
});
