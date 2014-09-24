import 'traceur'

import { async } from 'quiver-promise'

import { 
  simpleToStreamHandler, 
  streamToSimpleHandler 
} from '../lib/simple-handler.js'

import {
  textToStreamable, streamableToText, 
  textToStream, streamToText,
  emptyStreamable
} from 'quiver-stream-util'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()

describe('simple handler test', () => {
  it('json text convert', () => {
    var simpleHandler = (args, json) => {
      json.content.should.equal('hello world')

      return 'Hello World!'
    }

    var handler = simpleToStreamHandler(simpleHandler, 'json', 'text')
    var inStream = textToStreamable('{ "content": "hello world" }')

    return handler({}, inStream).then(streamableToText)
      .should.eventually.equal('Hello World!')
  })

  it('void stream convert', () => {
    var simpleHandler = (args, input) => {
      should.not.exist(input)
      return textToStream('hello world')
    }

    var handler = simpleToStreamHandler(simpleHandler, 'void', 'stream')

    return handler({}, emptyStreamable()).then(streamableToText)
      .should.eventually.equal('hello world')
  })

  it('void html convert', async(function*() {
    var html = '<b>Hello World</b>'

    var simpleHandler = args => html
    
    var handler = simpleToStreamHandler(simpleHandler, 
      'void', 'html')
    
    var resultStreamable = yield handler(
      {}, emptyStreamable())

    resultStreamable.contentType.should.equal('text/html')

    yield streamableToText(resultStreamable)
      .should.eventually.equal(html)
  }))

  it('stream void convert', () => {
    var simpleHandler = (args, readStream) =>
      streamToText(readStream).then(text => {
        text.should.equal('hello world')
        return null
      })


    var handler = simpleToStreamHandler(simpleHandler, 'stream', 'void')
    var inStream = textToStreamable('hello world')

    return handler({}, inStream).then(streamableToText)
      .should.eventually.equal('')
  })

  it('void json stream handler', () => {
    var streamHandler = (args, streamable) =>
      streamableToText(streamable).then(text => {
        text.should.equal('')

        return textToStreamable('{ "result": "hello world" }')
      })

    var handler = streamToSimpleHandler(streamHandler, 'void', 'json')

    return handler({}).then(json => {
      json.result.should.equal('hello world')
    })
  })

  it('stream void stream handler', () => {
    var streamHandler = (args, streamable) =>
      streamableToText(streamable).then(text => {
        text.should.equal('hello world')
        return emptyStreamable()
      })


    var handler = streamToSimpleHandler(streamHandler, 'stream', 'void')

    var inStream = textToStream('hello world')
    return handler({}, inStream).then(result =>
      should.not.exist(result))
  })
})