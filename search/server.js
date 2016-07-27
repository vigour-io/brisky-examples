'use strict'
const Hub = require('vigour-hub')
const hub = global.hub = new Hub({
  inject: require('./state'),
  port: 3031
}, 'init')
hub.scrapeSomeMovies()
