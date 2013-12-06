
'use strict'

var toSimpleHandler = require('./to-simple-handler')
var toStreamHandler = require('./to-stream-handler')

module.exports = {
  simpleHandlerToStreamHandler: 
    toStreamHandler.simpleHandlerToStreamHandler,
    
  simpleHandlerBuilderToStreamHandlerBuilder: 
    toStreamHandler.simpleHandlerBuilderToStreamHandlerBuilder,

  streamHandlerToSimpleHandler: 
    toSimpleHandler.streamHandlerToSimpleHandler
}