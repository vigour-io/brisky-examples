'use strict'
const render = require('brisky/render')
const state = require('./client')

const app = {
  text: { $: 'title' },
  holder: {
    top: {
      class: 'complex-item',
      title: { text: { $: 'query' } },
      symbol: {
        style: {
          opacity: {
            $: 'connected',
            $transform: (val) => val === true ? 1 : 0.4
          }
        }
      },
      input: {
        tag: 'input',
        class: 'basic-item',
        props: {
          value: { $: 'query' }
        },
        on: {
          keyup (e, stamp) {
            e.state.set({ query: e.target.value }, stamp)
          }
        }
      },
      addMovie: {
        class: 'basic-item',
        text: 'add movie',
        on: {
          click (e) {
            const cnt = Date.now()
            state.set({
              movies: {
                items: { [cnt]: { title: 'movie ' + cnt } }
              }
            })
          }
        }
      }
    }
  },
  movies: {
    class: 'holder',
    title: { text: 'movies' },
    $: 'movies.items.$any',
    child: {
      class: 'complex-item',
      title: { text: { $: 'title' } },
      removebtn: {
        class: 'basic-item',
        text: 'remove',
        $: true,
        on: {
          click (e) {
            e.state.remove()
          }
        }
      }
    }
  }
}

document.body.appendchild(render(app, state))
