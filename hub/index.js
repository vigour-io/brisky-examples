const Hub = require('vigour-hub')
const render = require('brisky/render')
const state = global.state = Hub({ connect: 'ws://localhost:3031' })

state.connected.on(function () {
  // want to be able to subscribe on this -- important!
  // add it in client (?)
  console.log('yo connected!', this.val)
})

const app = {
  top: {
    class: 'complex-item',
    title: { text: { $: 'field' } },
    inputfield: {
      node: 'input',
      class: 'basic-item',
      props: {
        value: { $: 'field' }
      },
      on: {
        keyup (e, stamp) {
          console.log(stamp)
          e.state.set({ field: e.target.value }, stamp)
        }
      }
    }
  },
  addMovie: {
    class: 'basic-item',
    text: 'add movie',
    on: {
      click (e) {
        var cnt = Date.now()
        state.set({
          movies: {
            [cnt]: {
              title: 'movie ' + cnt
            }
          }
        })
      }
    }
  },
  movies: {
    class: 'holder',
    title: { text: 'movies' },
    $: 'movies.$any',
    Child: {
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

document.body.appendChild(render(app, state))
