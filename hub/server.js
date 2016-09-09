'use strict'
const Hub = require('brisky-hub')
global.hub = new Hub({ port: 3031 })
console.log('start hub!')
