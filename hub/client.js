'use strict'
const Hub = require('brisky-hub')
// const State = require('vigour-state')

module.exports = global.state = new Hub({
  url: 'ws://imac.local:3030',
  context: false,
  clients: {
    on: {
      data () {
        console.log('hello')
      }
    }
  }
  // client: '$root.clients.client'
})
