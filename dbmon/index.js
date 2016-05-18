'use strict'
// -------------------------
// http://mathieuancelin.github.io/js-repaint-perfs/
// -------------------------
require('./style.css')
const render = require('brisky/render')
const s = require('vigour-state/s')
const getData = require('./data')
const amount = 50
const state = s(getData(amount))
// -------------------------
const app = {
  stats: {
    text: {
      $: 'fps',
      $transform: (val) => 'Repaint rate: ' + ~~(val * 100) / 100 + '/sec'
    }
  },
  table: {
    node: 'table',
    class: 'table-striped latest-data',
    body: {
      node: 'tbody',
      $: 'databases.$any',
      Child: {
        node: 'tr',
        name: {
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
var total = []
var d
function update () {
  var time = 0
  state.set(getData(amount))
  if (d) { total.push(Date.now() - d) }
  if (total.length > 120) {
    total.shift()
  }
  d = Date.now()
  for (let i = 0, len = total.length; i < len; i++) {
    time += total[i]
  }
  state.set({ fps: 1000 / (time / total.length) })
  setTimeout(update, 0)
}
update()
// -------------------------
