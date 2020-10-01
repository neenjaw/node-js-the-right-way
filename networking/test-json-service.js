'use strict'

const fs = require('fs')
const net = require('net')
const filename = process.argv[2]

if (!filename) {
  throw Error('Error: No filename specified.')
}

net
  .createServer((connection) => {
    // Reporting
    console.log('Subscriber.')

    const msg = JSON.stringify({ type: 'watching', file: filename }) + '\n'
    const msgHalfwayPoint = Math.floor(msg.length / 2)
    const firstChunk = msg.slice(0, msgHalfwayPoint)
    const secondChunk = msg.slice(msgHalfwayPoint)
    connection.write(firstChunk)

    const timer = setTimeout(() => {
      connection.write(secondChunk)
      connection.end()
    }, 100)

    // Cleanup
    connection.on('close', () => {
      clearTimeout(timer)
      console.log('Subscriber disconnected.')
    })
  })
  .listen(60300, () => console.log('Listening for subscribers..'))
