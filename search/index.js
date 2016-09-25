'use strict'
const Hub = require('brisky-hub')
const state = global.state = new Hub({
  url: global.location.href.indexOf('localhost') !== -1
    ? 'ws://localhost:3030'
    : 'wss://example-hub-yuajirpsyu.now.sh',
  context: false  // default context is your ip address
})

const render = require('brisky/render')
document.body.appendChild(render(require('./app'), state))
