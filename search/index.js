'use strict'
const render = require('brisky/render')
// document.body.appendChild(render(require('./app'), require('./state')))
document.body.appendChild(render(require('./app'), require('../hub/client')))
