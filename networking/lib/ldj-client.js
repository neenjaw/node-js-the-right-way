'use strict'

const EventEmitter = require('events').EventEmitter

// TODO: What happens if incoming data is not proper JSON?
// Should LDJClient emit a close event for its listeners?

class LDJClient extends EventEmitter {
  constructor(stream) {
    super()
    let buffer = ''
    stream.on('data', (data) => {
      buffer += data
      let boundary = buffer.indexOf('\n')
      while (boundary !== -1) {
        const input = buffer.substring(0, boundary)
        buffer = buffer.substring(boundary + 1)
        this.emit('message', JSON.parse(input))
        boundary = buffer.indexOf('\n')
      }
    })
  }

  static connect(stream) {
    return new LDJClient(stream)
  }
}

module.exports = LDJClient
