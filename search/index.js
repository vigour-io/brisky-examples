'use strict'
const Hub = require('brisky-hub')
const state = global.state = new Hub({
  url: 'ws://imac.local:3032',
  context: false  // default context is your ip address
})
// const State = require('vigour-state')

// const state = global.state = new State({})

// var obj = { movies: { items: {} } }
// var x = obj.movies.items
// for (var i = 0; i < 5e3; i++) {
//   x[i] = {
//     title: i,
//     stamp: i
//   }
// }

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

// state.set(obj)

console.info(global.s)
