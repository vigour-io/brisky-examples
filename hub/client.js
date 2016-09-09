'use strict'
const Hub = require('brisky-hub')
const State = require('vigour-state')
module.exports = global.state = new State({
  // url: 'ws://imac.local:3031',
  // context: false
  // client: '$root.clients.1'
})

module.exports.set({
  clients: {
    1: { id: 1 }
  }
}, false)

module.exports.set({
  client: module.exports.clients[1]
}, false)

module.exports = global.state = new Hub({
  url: 'ws://imac.local:3031',
  context: false
})
