'use strict'
require('../style.css')
const s = require('vigour-state/s')
const render = require('brisky/render')
const movies = require('./data.json')
const nav = require('dom-nav')

require('brisky').prototype.set({
  properties: {
    $condition: true
  }
})

const elem = {
  key: 'app',
  style: {
    textAlign: 'center'
  },
  text: 'search page!',
  field: {
    $: 'query',
    style: {
      width: '100%',
      height: '60px',
      textAlign: 'center'
    },
    node: 'input',
    on: {
      input (data, stamp) {
        data.state.getRoot().query.set(data.target.value)
      }
    }
  },
  holder: {
    class: 'complex-item',
    $: 'movies.items.$any',
    Child: {
      $: '$condition',
      $condition: {
        val (state) {
          const query = state.getRoot().query.compute()
          if (!query) {
            return true
          } else {
            const title = state.title && state.title.compute()
            return title && title.toLowerCase().indexOf(query.toLowerCase()) !== -1
          }
        },
        $subs: {
          title: {},
          $root: { query: {} }
        }
      },
      text: {
        $: '$parent.$parent.title'
      },
      on: {
        arrowup (data) {
          let target = nav.up(data.target)
          if (target) { target.focus() }
        },
        arrowdown (data) {
          let target = nav.down(data.target)
          if (target) { target.focus() }
        },
        arrowleft (data) {
          let target = nav.left(data.target)
          if (target) { target.focus() }
        },
        arrowright (data) {
          let target = nav.right(data.target)
          if (target) { target.focus() }
        }
      },
      class: 'complex-item'
    }
  }
}

const state = s({
  title: 'search app',
  query: 'w',
  movies: {
    title: 'movies list!',
    items: movies
  }
})

state.movies.set({
  focus: state.movies.items[1927]
})

state.set({
  focus: state.movies.focus
})

var treex
var topsubs
document.body.appendChild(render(elem, state,
  (state, type, stamp, nsubs, tree, sType, subs, rTree) => {
    console.log('---->', state.path())
    treex = rTree
    topsubs = subs
  })
)

console.log('---------')
console.log('rSubs:', topsubs)
console.log('rTree', treex)
console.log('---------')
