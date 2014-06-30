import { 
  streamableToText, streamableToJson,
  textToStreamable, jsonToStreamable,
  streamToStreamable, emptyStreamable
} from 'quiver-stream-util'

import { error } from 'quiver-error'
import { resolve, reject } from 'quiver-promise'

var convertHandler = (handler, inConvert, outConvert) =>
  (args, input) =>
    inConvert(input).then(input =>
      handler(args, input).then(result =>
        outConvert(result)))

var streamableToVoid = streamable => {
  if(streamable.reusable) return resolve()

  return streamable.toStream().then(readStream =>
    readStream.closeRead())
}

var voidToStreamable = () => resolve(emptyStreamable())

var readStreamToStreamable = (stream) => resolve(streamToStreamable(stream))

var streamableToStream = streamable => streamable.toStream()

var streamableToStreamable = streamable => resolve(streamable)

var streamToSimpleTable = {
  'void': streamableToVoid,
  'text': streamableToText,
  'json': streamableToJson,
  'stream': streamableToStream,
  'streamable': streamableToStreamable
}

var simpleToStreamTable = {
  'void': voidToStreamable,
  'text': textToStreamable,
  'json': jsonToStreamable,
  'stream': readStreamToStreamable,
  'streamable': streamableToStreamable
}

var createConverter = (inTable, outTable) =>
  (handler, inType, outType) =>  {
    var inConvert = inTable[inType]
    if(!inConvert) throw new Error('invalid simple type ' + inType)

    var outConvert = outTable[outType]
    if(!outConvert) throw new Error('invalid simple type ' + outType)

    return convertHandler(handler,inConvert, outConvert)
  }

export var simpleToStreamHandler = createConverter(
  streamToSimpleTable, simpleToStreamTable)

export var streamToSimpleHandler = createConverter(
  simpleToStreamTable, streamToSimpleTable)