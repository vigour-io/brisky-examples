'use strict'
const render = require('brisky/render')
const state = require('./client')

// need a way to offloead test and state for hub -- maybe split it in 2 proccess
const app = {
  text: { $: 'title' },
  holder: {
    top: {
      class: 'complex-item',
      title: { text: { $: 'query' } },
      symbol: {
        class: true,
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
        class: 'complex-item',
        text: 'add movie',
        on: {
          click (e) {
            const cnt = Date.now()
            state.set({
              movies: {
                items: { [cnt]: { title: 'movie ' + cnt, x: 100, y: 100 } }
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
      style: {
        // transform: {
        //   x: { $: 'x' },
        //   y: { $: 'y' }
        // },
        position: 'absolute',
        top: { $: 'y' },
        left: { $: 'x' }
      },
      on: {
        drag (e, stamp) {
          e.state.set({
            x: e.x - 50,
            y: e.y - 50
          })
        }
      },
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

document.body.appendChild(render(app, state))
