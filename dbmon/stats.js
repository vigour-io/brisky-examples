'use strict'
const Stats = require('stats-js')
const stats = new Stats()
stats.setMode(0)
stats.domElement.className = 'stats'
document.body.appendChild(stats.domElement)
module.exports = stats
