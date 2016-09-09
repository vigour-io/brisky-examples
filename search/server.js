'use strict'
const Hub = require('brisky-hub')
const hub = global.hub = new Hub({
  inject: require('./state'),
  port: 3031
}, 'init')
hub.scrapeSomeMovies()
