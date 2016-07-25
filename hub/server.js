'use strict'
const Hub = require('vigour-hub')
global.hub = new Hub({ port: 3031 })
console.log('start hub!')
