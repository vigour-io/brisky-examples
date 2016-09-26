'use strict'
const Hub = require('brisky-hub')
global.hub = new Hub({
  query: 'hello',
  movies: {
    items: [
      { title: 'hello' },
      { title: 'goodbye' }
    ]
  },
  port: 3030
})
console.log('start hub!')
