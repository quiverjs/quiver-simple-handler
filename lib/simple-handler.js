import { 
  streamableToText, streamableToJson,
  textToStreamable, jsonToStreamable,
  streamToStreamable, emptyStreamable
} from 'quiver-stream-util'

import { error } from 'quiver-error'
import { resolve, reject, safePromised } from 'quiver-promise'

var convertHandler = (handler, inConvert, outConvert) =>
  (args, input) =>
    resolve(inConvert(input)).then(input =>
      handler(args, input).then(result =>
        outConvert(result)))

var streamableToVoid = streamable => {
  if(streamable.reusable) return resolve()

  return streamable.toStream().then(readStream =>
    readStream.closeRead())
}

var voidToStreamable = () => resolve(emptyStreamable())

var streamableToStream = streamable => streamable.toStream()

var streamableToStreamable = streamable => resolve(streamable)

var htmlToStreamable = (text) => textToStreamable(text, 'text/html')

var streamToSimpleTable = {
  'void': streamableToVoid,
  'text': streamableToText,
  'html': streamableToText,
  'json': streamableToJson,
  'stream': streamableToStream,
  'streamable': streamableToStreamable
}

var simpleToStreamTable = {
  'void': voidToStreamable,
  'text': textToStreamable,
  'html': htmlToStreamable,
  'json': jsonToStreamable,
  'stream': streamToStreamable,
  'streamable': streamableToStreamable
}

var createConverter = (inTable, outTable) =>
  (handler, inType, outType) =>  {
    var inConvert = inTable[inType]
    if(!inConvert) throw new Error('invalid simple type ' + inType)

    var outConvert = outTable[outType]
    if(!outConvert) throw new Error('invalid simple type ' + outType)

    return convertHandler(safePromised(handler), 
      inConvert, outConvert)
  }

export var simpleToStreamHandler = createConverter(
  streamToSimpleTable, simpleToStreamTable)

export var streamToSimpleHandler = createConverter(
  simpleToStreamTable, streamToSimpleTable)

export var validateSimpleTypes = types => {
  for(var type of types) {
    if(!streamToSimpleTable[type]) {
      return new Error('invalid simple type ' + type)
    }
  }
}