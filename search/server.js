'use strict'
const Hub = require('brisky-hub')
const hub = global.hub = new Hub({
  inject: require('./state'),
  port: process.argv[2] || 80
})
hub.init(process.argv.indexOf('--cache') !== -1)
console.log('start hub', process.argv.slice(2))
