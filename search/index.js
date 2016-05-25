'use strict'
const Hub = require('vigour-hub')
const state = global.state = new Hub({
  url: 'ws://imac:3031',
  context: false // default context is your ip address
})

const benchmark = require('../benchmark')

benchmark.loop(
  0,
  require('./app'),
  false,
  (state, cnt) => {
    let movies = state.get('movies.items')
    if (movies) {
      let q = movies[movies._keys[~~(Math.random() * movies._keys.length)]].title.val
      state.query && state.query.set({ val: q, sync: false })
    }
  },
  state
)

// const render = require('brisky/render')
// document.body.appendChild(render(require('./app'), state))
