
'use strict'

var streamConvert = require('quiver-stream-convert')
var streamChannel = require('quiver-stream-channel')

var typedStreamHandlerInputConverter = function(convertFunction) {
  return function(streamHandler) {
    var simpleHandler = function(args, input, callback) {
      var inputStreamable = convertFunction(input)
      streamHandler(args, inputStreamable, callback)
    }

    return simpleHandler
  }
}

var typedStreamHandlerOutputConverter = function(convertFunction) {
  return function(streamHandler) {
    var simpleHandler = function(args, inputStreamable, callback) {
      streamHandler(args, inputStreamable, function(err, resultStreamable) {
        if(err) return callback(err)

        convertFunction(resultStreamable, callback)
      })
    }

    return simpleHandler
  }
}

var voidStreamHandlerInputConverter = function(streamHandler) {
  var simpleHandler = function(args, callback) {
    streamHandler(args, streamChannel.createEmptyStreamable(), callback)
  }

  return simpleHandler
}

var voidStreamHandlerOutputConverter = function(streamHandler) {
  var simpleHandler = function(args, inputStreamable, callback) {
    streamHandler(args, inputStreamable, function(err, resultStreamable) {
      if(err || resultStreamable.reusable) return callback(err)

      resultStreamable.toStream(function(err, readStream) {
        if(!err) readStream.closeRead()

        callback()
      })
    })
  }

  return simpleHandler
}

var noopInputConvert = function(streamable) {
  return streamable
}

var noopOutputConvert = function(streamable, callback) {
  callback(null, streamable)
}

var streamableToStream = function(streamable, callback) {
  streamable.toStream(callback)
}

var inputConvertTable = {
  'text': typedStreamHandlerInputConverter(
    streamConvert.textToStreamable),

  'json': typedStreamHandlerInputConverter(
    streamConvert.jsonToStreamable),

  'stream': typedStreamHandlerInputConverter(
    streamConvert.streamToStreamable),

  'streamable': typedStreamHandlerInputConverter(
    noopInputConvert),

  'void': voidStreamHandlerInputConverter
}

var outputConvertTable = {
  'text': typedStreamHandlerOutputConverter(
    streamConvert.streamableToText),

  'json': typedStreamHandlerOutputConverter(
    streamConvert.streamableToJson),

  'stream': typedStreamHandlerOutputConverter(
    streamableToStream),

  'streamable': typedStreamHandlerOutputConverter(
    noopOutputConvert),

  'void': voidStreamHandlerOutputConverter
}

var streamHandlerToSimpleHandler = function(inputType, outputType, streamHandler) {
  var inputHandlerConverter = inputConvertTable[inputType]
  if(!inputHandlerConverter) throw new Error('invalid simple handler input type ' + inputType)

  var outputHandlerConverter = outputConvertTable[outputType]
  if(!outputHandlerConverter) throw new Error('invalid simple handler output type ' + outputType)

  var simpleHandler = inputHandlerConverter(outputHandlerConverter(streamHandler))
  return simpleHandler
}

module.exports = {
  streamHandlerToSimpleHandler: streamHandlerToSimpleHandler
}