'use strict'
const render = require('brisky/render')
const state = require('./client')

const app = {
  // need this in all examples
  child: {
    class: true,
    child: 'Constructor'
  },
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
                items: { [cnt]: { title: 'movie ' + cnt, x: 100, y: 100, bla: 'hello!' } }
              }
            })
          }
        }
      }
    }
  },
  clients: {
    class: 'holder',
    title: { text: 'clients' },
    $: 'clients.$any',
    child: {
      class: 'basic-item',
      style: {
        background: {
          $: true,
          $transform: (val, state) => state.getRoot().get('client.origin') === state
            ? 'rgba(0,0,0,0.2)'
            : null
        }
      },
      text: { $: 'id' }
    }
  },
  movies: {
    class: 'holder',
    title: { text: 'movies' },
    $: 'movies.items.$any',
    child: {
      class: 'complex-item',
      input: {
        tag: 'input',
        props: {
          value: { $: 'title' }
        },
        on: {
          keyup (e) {
            e.state.set({ title: e.target.value })
          }
        }
      },
      style: {
        // maybe its a problem with group 100 double check this...
        // transform: {
        //   x: { $: 'x' },
        //   y: { $: 'y' }
        // },
        // position: 'absolute',
        // top: { $: 'y' },
        // left: { $: 'x' }
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
