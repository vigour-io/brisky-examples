'use strict'
const Hub = require('vigour-hub')
module.exports = global.state = new Hub({
  url: 'ws://imac:3031',
  context: false
})
