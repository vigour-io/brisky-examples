'use strict'
// http://mathieuancelin.github.io/js-repaint-perfs/
// -------------------------
const Stats = require('stats-js')
const stats = new Stats()
stats.setMode(0)
stats.domElement.className = 'stats'
document.body.appendChild(stats.domElement)
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
            class: 'Query',
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

function update () {
  stats.begin()
  state.set(getData(amount))
  global.requestAnimationFrame(update)
  stats.end()
}

update()
