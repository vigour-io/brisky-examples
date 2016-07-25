'use strict'
require('../style.css')
const render = require('brisky/render')
const s = require('vigour-state/s')
const app = {
  key: 'app',
  text: 'collection',
  holder: {
    $: '$any',
    child: {
      class: 'basic-item',
      text: { $: 'title', $transform: (val, state) => state.parent.key + ':' + val }
    }
  }
}

const state = global.state = s({
  sort: 'title',
  a: { title: 1, nr: 1 },
  b: { title: 0, nr: 2 },
  c: { title: -1, nr: 3 },
  d: { title: -20, nr: 3 },
  e: { title: -30, nr: 3 }
})

document.body.appendChild(render(app, state))

setTimeout(function () {
  state.a.title.set(-2)
}, 1000)

setTimeout(function () {
  state.c.title.set(-3)
}, 2000)

setTimeout(function () {
  const sort = state.sortMethod
  state.set({
    sort: {
      exec: (a, b) => sort(a, b) * -1
      // transform would be very nice
    }
  })
}, 3000)
