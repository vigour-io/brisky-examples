'use strict'
const Hub = require('brisky-hub')
const hub = global.hub = new Hub({
  inject: require('./state'),
  port: process.argv[2] || 80
}, 'init')
hub.init(process.argv[3] === '--cache')
