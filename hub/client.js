'use strict'
const Hub = require('brisky-hub')
// const State = require('vigour-state')

module.exports = global.state = new Hub({
  url: 'ws://imac.local:3031',
  context: false
  // client: '$root.clients.client'
})
