'use strict'
require('../style.css')
const s = require('vigour-state/s')
const render = require('brisky/render')
const movies = require('./data.json')

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
      props: {
        tabindex: 0
      },
      focus: {
        $: 'focus'
      },
      on: {
        arrowup (data) {
          let target = data.target
          let prev = target.previousSibling
          if (prev) {
            const top = target.offsetTop
            const center = target.offsetLeft + target.offsetWidth * 0.5
            while (prev && prev.offsetTop >= top) {
              prev = prev.previousSibling
            }
            while (prev) {
              if (prev.offsetLeft <= center && prev.offsetLeft + prev.offsetWidth >= center) {
                return prev.focus()
              } else {
                target = prev = prev.previousSibling
              }
            }
            if (target) {
              target.focus()
            }
          } else {

          }
        },
        arrowdown (data) {
          let target = data.target
          let next = target.nextSibling
          const top = target.offsetTop
          const center = target.offsetLeft + target.offsetWidth * 0.5
          while (next && next.offsetTop <= top) {
            next = next.nextSibling
          }
          while (next) {
            if (next.offsetLeft <= center && (next.offsetLeft + next.offsetWidth >= center)) {
              return next.focus()
            } else {
              target = next = next.nextSibling
            }
          }
          if (target) {
            target.focus()
          }
        },
        arrowleft (data) {
          const prev = data.target.previousSibling
          if (prev) { prev.focus() }
        },
        arrowright (data) {
          const next = data.target.nextSibling
          if (next) { next.focus() }
        }
      },
      class: 'complex-item',
      title: {
        text: {
          $: 'title'
        }
      },
      searchtitle: {
        text: {
          $: '$root.title'
        }
      },
      subtitle: [
        {
          type: 'text',
          $: 'releaseYear',
          $add: ' - '
        },
        {
          type: 'text',
          $: 'releaseCountry'
        }
      ]
    }
  }
}

const state = global.state = s({
  title: 'search app',
  query: '',
  movies: {
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
