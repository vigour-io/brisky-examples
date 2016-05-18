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
    focus: { $: '$root.focus' },
    on: {
      input (data, stamp) {
        data.state.getRoot().query.set(data.target.value, stamp)
      },
      change (data, stamp) {
        const rootstate = data.state.getRoot()
        const moviesfocus = rootstate.movies.focus
        rootstate.focus.set(moviesfocus, stamp)
        moviesfocus.emit('data', stamp)
        if (document.activeElement === data.target) {
          data.target.parentNode.childNodes[2].firstChild.focus()
        }
      },
      arrowdown (data, stamp) {
        const rootstate = data.state.getRoot()
        const moviesfocus = rootstate.movies.focus
        rootstate.focus.set(moviesfocus, stamp)
        moviesfocus.emit('data', stamp)
        if (document.activeElement === data.target) {
          data.target.parentNode.childNodes[2].firstChild.focus()
        }
      }
    }
  },
  holder: {
    $: 'movies.items.$any',
    Child: {
      $: '$condition',
      class: 'basic-item',
      focus: {
        $: '$parent.$parent.focus'
      },
      text: {
        $: 'title'
      },
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
      on: {
        arrowup (data, stamp) {
          let target = nav.up(data.target)
          if (target) {
            target.focus()
          } else {
            state.focus.set(state.query, stamp)
          }
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
      }
    }
  }
}

const state = global.state = s({
  title: 'search app',
  query: '',
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
    treex = rTree
    topsubs = subs
  })
)

console.log('---------')
console.log('rSubs:', topsubs)
console.log('rTree', treex)
console.log('---------')
