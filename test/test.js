
'use strict'

var should = require('should')
var streamChannel = require('quiver-stream-channel')
var streamConvert = require('quiver-stream-convert')
var simpleHandler = require('../lib/simple-handler')

describe('simple handler test', function() {
  it('json text convert', function(callback) {
    var testHandler = function(args, json, callback) {
      json.content.should.equal('hello world')

      callback(null, 'hello world')
    }

    var handler = simpleHandler.simpleHandlerToStreamHandler('json', 'text', testHandler)

    var testIn = streamConvert.jsonToStreamable({ content: 'hello world' })
    handler({}, testIn, function(err, resultStreamable) {
      if(err) return callback(err)

      streamConvert.streamableToText(resultStreamable, function(err, text) {
        if(err) return callback(err)

        text.should.equal('hello world')
        callback()
      })
    })
  })

  it('void stream convert', function(callback) {
    var testHandler = function(args, callback) {
      callback(null, streamConvert.textToStream('hello world'))
    }

    var handler = simpleHandler.simpleHandlerToStreamHandler('void', 'stream', testHandler)
    handler({}, streamChannel.createEmptyStreamable(), function(err, readStream) {
      if(err) return callback(err)

      streamConvert.streamableToText(readStream, function(err, text) {
        if(err) return callback(err)

        text.should.equal('hello world')
        callback()
      })
    })
  })

  it('stream void convert', function(callback) {
    var testHandler = function(args, readStream, callback) {
      streamConvert.streamToText(readStream, function(err, text) {
        if(err) callback(err)

        text.should.equal('hello world')
        callback()
      })
    }

    var handler = simpleHandler.simpleHandlerToStreamHandler('stream', 'void', testHandler)
    var testIn = streamConvert.textToStreamable('hello world')

    handler({}, testIn, function(err, resultStreamable) {
      if(err) return callback(err)

      streamConvert.streamableToText(resultStreamable, function(err, text) {
        if(err) return callback(err)

        text.should.equal('')
        callback()
      })
    })
  })

  it('handler builder test', function(callback) {
    var testHandlerBuilder = function(config, callback) {
      var handler = function(args, text, callback) {
        text.should.equal('hello world')
        callback(null, { result: 'hello world' })
      }
      callback(null, handler)
    }

    var handleableBuilder = simpleHandler.simpleHandlerBuilderToHandleableBuilder(
      'text', 'json', testHandlerBuilder)

    handleableBuilder({}, function(err, handleable) {
      if(err) return callback(err)

      handleable.toSimpleHandler('text', 'json', function(err, handler) {
        if(err) return callback(err)

        handler({}, 'hello world', function(err, json) {
          if(err) return callback(err)

          json.result.should.equal('hello world')
          callback()
        })
      })
    })
  })
})