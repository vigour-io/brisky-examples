'use strict'
// -------------------------
// for comparable results
// https://github.com/Matt-Esch/virtual-dom/issues/371
// -------------------------
const benchmark = require('../benchmark')
require('../style.css')

benchmark.loop(
  25e2,
  {
    key: 'app',
    text: 'basic',
    holder: {
      $: 'collection.$any',
      Child: {
        tag: 'span',
        class: 'basic-item',
        text: { $: '$root.title' }
      }
    }
  },
  (i, cnt) => {
    return {}
  },
  (state, cnt) => {
    state.set({ title: cnt })
  }
)
