'use strict'
// http://mathieuancelin.github.io/js-repaint-perfs/
// this example assumes no special hackery in the data -- (see inferno dbmon)
// https://github.com/trueadm/inferno/tree/master/examples/dbmonster
// -------------------------
const stats = require('./stats')
// -------------------------
require('./style.css')
const render = require('brisky/render')
const s = require('vigour-state/s')
const getData = require('./data')
const amount = 50
const state = s(getData(amount))

const app = {
  key: 'app',
  table: {
    node: 'table',
    class: 'table-striped latest-data',
    body: {
      node: 'tbody',
      $: 'databases.$any',
      Child: {
        node: 'tr',
        dbname: {
          node: 'td',
          text: {
            $: true,
            $transform: (val) => val.key
          }
        },
        count: {
          node: 'td',
          label: {
            node: 'span',
            text: { $: 'length' },
            class: {
              $: 'length',
              $transform: (val) => val > 4 ? 'label-warning' : 'label-success'
            }
          }
        },
        queries: {
          node: 'fragment',
          $: 'queries.$any',
          Child: {
            node: 'td',
            class: 'query',
            text: {
              $: 'elapsed',
              $transform: (val) => val && ~~(val * 100) / 100
            },
            popover: {
              class: 'left',
              arrow: {},
              'popover-content': {
                text: { $: 'query' }
              }
            }
          }
        }
      }
    }
  }
}

document.body.appendChild(render(app, state))
// -------------------------
function update () {
  stats.begin()
  state.set(getData(amount))
  stats.end()
  setTimeout(update)
}
update()
// -------------------------
