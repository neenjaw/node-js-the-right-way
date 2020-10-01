'use strict'

const assert = require('assert')
const EventEmitter = require('events').EventEmitter
const LDJClient = require('../lib/ldj-client')

// TODO:
// - Write a test case which sends data eevnt that is not JSON
// - Write a case where the stream object sends a data event with no newline
//   followed by a close event

describe('LDJClient', () => {
  let stream = null
  let client = null

  beforeEach(() => {
    stream = new EventEmitter()
    client = new LDJClient(stream)
  })

  it('should emit a message event from a single data event', (done) => {
    client.on('message', (message) => {
      assert.deepStrictEqual(message, { foo: 'bar' })
      done()
    })
    stream.emit('data', `${JSON.stringify({ foo: 'bar' })}\n`)
  })

  it('should emit a message event from split data events', (done) => {
    client.on('message', (message) => {
      assert.deepStrictEqual(message, { foo: 'bar' })
      done()
    })
    stream.emit('data', '{"foo":')
    process.nextTick(() => stream.emit('data', '"bar"}\n'))
  })

  it('should finish within 5 seconds', (done) => {
    setTimeout(done, 4500)
  }).timeout(5000)
})
