'use strict'
const Hub = require('brisky-hub')
const state = global.state = new Hub({
  url: 'ws://imac.local:3031',
  context: false  // default context is your ip address
})
// const State = require('vigour-state')
// const state = global.state = new State(require('./state'))
// state.scrapeSomeMovies()
// const benchmark = require('../benchmark')
// benchmark.loop(
//   0,
//   require('./app'),
//   false,
//   (state, cnt) => {
//     let movies = state.get('movies.items')
//     if (movies) {
//       let q = movies[movies._keys[~~(Math.random() * movies._keys.length)]].get('title.val')
//       state.query && state.query.set({ val: q, sync: false })
//     }
//   },
//   state
// )

const render = require('brisky/render')
document.body.appendChild(render(require('./app'), state, (s) => {
  global.s = s
}))

console.info(global.s)
