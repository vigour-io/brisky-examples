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
          var query = state.getRoot().query.compute()
          if (!query) {
            return true
          } else {
            var title = state.title && state.title.compute()
            if (title) {
              return title.toLowerCase().indexOf(query.toLowerCase()) !== -1
            }
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
      // focus: {
      //   $: 'focus'
      // },
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
                prev.focus()
                return
              }
              target = prev
              prev = prev.previousSibling
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
              next.focus()
              return
            }
            target = next
            next = next.nextSibling
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

const state = s({
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

document.body.appendChild(render(elem, state))

console.log('data length:', Object.keys(movies).length)

// function jump () {
//   setTimeout(function () {
//     state.query.set('jump')
//     matthew()
//   }, 1000)
// }

// function matthew () {
//   setTimeout(function () {
//     state.query.set('inter')
//     jump()
//   }, 1000)
// }

// jump()
