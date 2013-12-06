
'use strict'

var streamConvert = require('quiver-stream-convert')
var streamChannel = require('quiver-stream-channel')
var error = require('quiver-error').error

var typedSimpleHandlerInputConverter = function(convertFunction) {
  var handlerConverter = function(simpleHandler) {
    var convertedHandler = function(args, inputStreamable, callback) {
      convertFunction(inputStreamable, function(err, simpleInput) {
        if(err) return callback(err)

        simpleHandler(args, simpleInput, callback)
      })
    }

    return convertedHandler
  }

  return handlerConverter
}

var voidSimpleHandlerInputConverter = function(simpleHandler) {
  var convertedHandler = function(args, inputStreamable, callback) {
    if(inputStreamable.reusable) return simpleHandler(args, callback)

    inputStreamable.toStream(function(err, readStream) {
      if(!err) readStream.closeRead()

      simpleHandler(args, callback)
    })
  }

  return convertedHandler
}

var typedSimpleHandlerOutputConverter = function(convertFunction) {
  var handlerConverter = function(simpleHandler) {
    var convertedHandler = function(args, inputStreamable, callback) {
      simpleHandler(args, inputStreamable, function(err, simpleOutput) {
        if(err) return callback(err)

        var resultStreamable = convertFunction(simpleOutput)
        callback(null, resultStreamable)
      })
    }

    return convertedHandler
  }

  return handlerConverter
}

var voidSimpleHandlerOutputConverter = function(simpleHandler) {
  var convertedHandler = function(args, inputStreamable, callback) {
    simpleHandler(args, inputStreamable, function(err) {
      if(err) return callback(err)

      callback(null, streamChannel.createEmptyStreamable())
    })
  }

  return convertedHandler
}

var noopInputConvert = function(streamable, callback) {
  callback(null, streamable)
}

var noopOutputConvert = function(streamable) {
  return streamable
}

var streamableToStream = function(streamable, callback) {
  streamable.toStream(callback)
}

var inputConvertTable = {
  'text': typedSimpleHandlerInputConverter(
    streamConvert.streamableToText),

  'json': typedSimpleHandlerInputConverter(
    streamConvert.streamableToJson),

  'stream': typedSimpleHandlerInputConverter(
    streamableToStream),

  'streamable': typedSimpleHandlerInputConverter(
    noopInputConvert),

  'void': voidSimpleHandlerInputConverter
}

var outputConvertTable = {
  'text': typedSimpleHandlerOutputConverter(
    streamConvert.textToStreamable),

  'json': typedSimpleHandlerOutputConverter(
    streamConvert.jsonToStreamable),

  'stream': typedSimpleHandlerOutputConverter(
    streamConvert.streamToStreamable),

  'streamable': typedSimpleHandlerOutputConverter(
    noopOutputConvert),

  'void': voidSimpleHandlerOutputConverter
}

var simpleHandlerToStreamHandler = function(inputType, outputType, simpleHandler) {
  var inputHandlerConverter = inputConvertTable[inputType]
  if(!inputHandlerConverter) throw new Error('invalid simple handler input type ' + inputType)

  var outputHandlerConverter = outputConvertTable[outputType]
  if(!outputHandlerConverter) throw new Error('invalid simple handler output type ' + outputType)

  var streamHandler = outputHandlerConverter(inputHandlerConverter(simpleHandler))

  return streamHandler
}

var simpleHandlerBuilderToStreamHandlerBuilder = function(inputType, outputType, simpleHandlerBuilder) {
  var streamHandlerBuilder = function(config, callback) {
    simpleHandlerBuilder(config, function(err, simpleHandler) {
      if(err) return callback(err)

      var streamHandler = simpleHandlerToStreamHandler(inputType, outputType, simpleHandler)
      callback(null, streamHandler)
    })
  }

  return streamHandlerBuilder
}

module.exports = {
  simpleHandlerToStreamHandler: simpleHandlerToStreamHandler,
  simpleHandlerBuilderToStreamHandlerBuilder: simpleHandlerBuilderToStreamHandlerBuilder,
}