'use strict'

const fs = require('fs')
const zmq = require('zeromq')

const responder = zmq.socket('rep')

responder.on('message', (data) => {
  const request = JSON.parse(data)
  console.log(`Received request to get: ${request.path}`)

  fs.readFile(request.path, (err, content) => {
    if (err) {
      responder.send(
        JSON.stringify({
          error: [
            {
              type: 'read-error',
              msg: `Unable to get: ${request.path}`,
            },
          ],
        })
      )

      return
    }

    console.log(`Sending response content.`)
    responder.send(
      JSON.stringify({
        content: content.toString(),
        timestamp: Date.now(),
        pid: process.pid,
      })
    )
  })
})

responder.bindSync('tcp://127.0.0.1:60401', (err) => {
  console.log('Listening for zmq requesters...')
})

process.on('SIGINT', () => {
  console.log('Shutting down...')
  responder.close()
})

process.on('SIGTERM', () => {
  console.log('Shutting down...')
  responder.close()
})

// To catch errors, need to bindSync the port for the zmq socket
// Otherwise it errors, "socket is busy"
process.on('uncaughtException', () => {
  console.log('Error encountered. Shutting down...')
  responder.close()
})
