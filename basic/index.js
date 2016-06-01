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
    class: 'app',
    text: 'basic',
    update: false,
    holder: {
      class: true,
      $: 'collection.$any',
      child: {
        tag: 'span',
        class: 'basic-item',
        text: { $: 'title' } // lookup 2 per thing and then one extra for the parent very very bad
      }
    }
  },
  (i, cnt) => {
    return { title: i + cnt }
  }
)
