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

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
let should = chai.should()

describe('simple handler test', () => {
  it('json text convert', () => {
    let simpleHandler = (args, json) => {
      json.content.should.equal('hello world')

      return 'Hello World!'
    }

    let handler = simpleToStreamHandler(simpleHandler, 'json', 'text')
    let inStream = textToStreamable('{ "content": "hello world" }')

    return handler({}, inStream).then(streamableToText)
      .should.eventually.equal('Hello World!')
  })

  it('void stream convert', () => {
    let simpleHandler = (args, input) => {
      should.not.exist(input)
      return textToStream('hello world')
    }

    let handler = simpleToStreamHandler(simpleHandler, 'void', 'stream')

    return handler({}, emptyStreamable()).then(streamableToText)
      .should.eventually.equal('hello world')
  })

  it('void html convert', async(function*() {
    let html = '<b>Hello World</b>'

    let simpleHandler = args => html
    
    let handler = simpleToStreamHandler(simpleHandler, 
      'void', 'html')
    
    let resultStreamable = yield handler(
      {}, emptyStreamable())

    resultStreamable.contentType.should.equal('text/html')

    yield streamableToText(resultStreamable)
      .should.eventually.equal(html)
  }))

  it('stream void convert', () => {
    let simpleHandler = (args, readStream) =>
      streamToText(readStream).then(text => {
        text.should.equal('hello world')
        return null
      })


    let handler = simpleToStreamHandler(simpleHandler, 'stream', 'void')
    let inStream = textToStreamable('hello world')

    return handler({}, inStream).then(streamableToText)
      .should.eventually.equal('')
  })

  it('void json stream handler', () => {
    let streamHandler = (args, streamable) =>
      streamableToText(streamable).then(text => {
        text.should.equal('')

        return textToStreamable('{ "result": "hello world" }')
      })

    let handler = streamToSimpleHandler(streamHandler, 'void', 'json')

    return handler({}).then(json => {
      json.result.should.equal('hello world')
    })
  })

  it('stream void stream handler', () => {
    let streamHandler = (args, streamable) =>
      streamableToText(streamable).then(text => {
        text.should.equal('hello world')
        return emptyStreamable()
      })


    let handler = streamToSimpleHandler(streamHandler, 'stream', 'void')

    let inStream = textToStream('hello world')
    return handler({}, inStream).then(result =>
      should.not.exist(result))
  })
})