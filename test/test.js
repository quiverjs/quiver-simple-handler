
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

  it('void json stream handler', function(callback) {
    var streamHandler = function(args, inputStreamable, callback) {
      streamConvert.streamableToText(inputStreamable, function(err, text) {
        if(err) return callback(err)

        text.should.equal('')
        callback(null, streamConvert.jsonToStreamable({ result: 'hello world' }))
      })
    }

    var testHandler = simpleHandler.streamHandlerToSimpleHandler('void', 'json', streamHandler)

    testHandler({}, function(err, json) {
      if(err) return callback(err)

      json.result.should.equal('hello world')
      callback()
    })
  })

  it('stream void stream handler', function(callback) {
    var streamHandler = function(args, inputStreamable, callback) {
      streamConvert.streamableToText(inputStreamable, function(err, text) {
        if(err) return callback(err)

        text.should.equal('hello world')
        callback(null, streamChannel.createEmptyStreamable())
      })
    }

    var testHandler = simpleHandler.streamHandlerToSimpleHandler('stream', 'void', streamHandler)

    var readStream = streamConvert.textToStream('hello world')
    testHandler({}, readStream, function(err, result) {
      if(err) return callback(err)
      should.not.exist(result)

      callback()
    })
  })
})