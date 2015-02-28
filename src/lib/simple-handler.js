import { 
  streamableToText, streamableToJson,
  textToStreamable, jsonToStreamable,
  streamToStreamable, emptyStreamable
} from 'quiver-stream-util'

import { error } from 'quiver-error'
import { resolve, reject, safePromised } from 'quiver-promise'

let convertHandler = (handler, inConvert, outConvert) =>
  (args, input) =>
    resolve(inConvert(input)).then(input =>
      handler(args, input).then(result =>
        outConvert(result)))

let streamableToVoid = streamable => {
  if(streamable.reusable) return resolve()

  return streamable.toStream().then(readStream =>
    readStream.closeRead())
}

let voidToStreamable = () => resolve(emptyStreamable())

let streamableToStream = streamable => streamable.toStream()

let streamableToStreamable = streamable => resolve(streamable)

let htmlToStreamable = (text) => textToStreamable(text, 'text/html')

let streamToSimpleTable = {
  'void': streamableToVoid,
  'text': streamableToText,
  'string': streamableToText,
  'html': streamableToText,
  'json': streamableToJson,
  'stream': streamableToStream,
  'streamable': streamableToStreamable
}

let simpleToStreamTable = {
  'void': voidToStreamable,
  'text': textToStreamable,
  'string': textToStreamable,
  'html': htmlToStreamable,
  'json': jsonToStreamable,
  'stream': streamToStreamable,
  'streamable': streamableToStreamable
}

let createConverter = (inTable, outTable) =>
  (handler, inType, outType) =>  {
    let inConvert = inTable[inType]
    if(!inConvert) throw new Error('invalid simple type ' + inType)

    let outConvert = outTable[outType]
    if(!outConvert) throw new Error('invalid simple type ' + outType)

    return convertHandler(safePromised(handler), 
      inConvert, outConvert)
  }

export let simpleToStreamHandler = createConverter(
  streamToSimpleTable, simpleToStreamTable)

export let streamToSimpleHandler = createConverter(
  simpleToStreamTable, streamToSimpleTable)

export let validateSimpleTypes = types => {
  for(let type of types) {
    if(!streamToSimpleTable[type]) {
      return new Error('invalid simple type ' + type)
    }
  }
}