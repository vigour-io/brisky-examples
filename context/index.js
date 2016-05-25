'use strict'
require('../style.css')
const render = require('brisky/render')
const s = require('vigour-state/s')

const state = s({
  greeting: 'hello',
  cat: 'http://loremflickr.com',
  border: 'solid white',
  random: Math.random() + '',
  field: '\nfield',
  fields: {
    a: {
      val: 'a',
      b: 'a/b'
    },
    c: {
      val: 'c',
      b: 'c/b'
    }
  },
  collection: [
    { b: '0/b' },
    {
      b: '1/b',
      list: {
        a: {

          text: 'b/1/nested/a'
        },
        b: { text: 'b/1/nested/b' }
      }
    },
    { b: '2/b' }
  ]
})

document.body.appendchild(render({
  text: 'context',
  key: 'app',
  child: { class: 'holder' },
  types: {
    t: {
      type: 'text',
      $: 'b',
      $transform (val) { return ` ${val} ` }
    },
    other: {
      class: 'basic-item',
      $: 'fields.a',
      child: { type: 't' },
      t: { $: true },
      t2: {},
      t3: {},
      t4: { $: false, val: 'static' }
    },
    cat: {
      tag: 'img',
      class: {
        'basic-item': true,
        'whitefilter': true
        // 'basic-item': true,
        // 'whitefilter': {
        //   $: 'random',
        //   transform () {
        //     return true
        //   }
        // }
      },
      style: {
        types: {
          fatborder: {
            name: 'border',
            $: 'border'
          }
        },
        properties: {
          fatborder: {
            type: 'fatborder'
          }
        },
        fatborder: {
          $transform (val) {
            return (Math.random() * 30) + 'px ' + val
          }
        },
        fakeborder: {
          type: 'fatborder',
          name: 'backgroundColor',
          $transform (val) {
            return 'black'
          }
        }
      },
      props: {
        types: {
          greeting: {
            $: 'greeting',
            $transform (val) {
              return (val !== this && val !== true && val) || 'greetings!'
            }
          },
          cat: {
            $: 'cat',
            $add: {
              val: '/100/100',
              $add () { return '?' + Math.random() }
            },
            name: 'src'
          }
        },
        properties: {
          greeting: { type: 'greeting' },
          cat: { type: 'cat' },
          largeCat: {
            type: 'cat',
            $add: '/500/500'
          }
        },
        greeting: true,
        cat: true,
        otherGreeting: { type: 'greeting' },
        staticGreeting: { type: 'greeting', $: false, val: 'gutten morgen' }
      }
    },
    collection: {
      class: 'complex-item fill',
      title: { text: 'collection' },
      $: 'collection.$any',
      child: {
        class: 'complex-item',
        title: { text: { $: 'b' } },
        nested: {
          $: 'list.$any',
          child: {
            class: 'basic-item',
            text: { $: 'text' }
          }
        },
        footer: {
          symbol: {}
        }
      }
    }
  },
  elems: {
    title: {
      $: 'fields',
      text: {
        $: true,
        $transform (val) {
          return 'elements ' + val.keys()
        }
      }
    },
    other2: { type: 'other', $: 'fields.c' },
    other: { type: 'other' }
  },
  propsholder: {
    title: { text: 'props' },
    props: {
      haha: 'ha!',
      yuzi: { $: 'field' }
    },
    first: { type: 'cat' },
    second: {
      type: 'cat',
      props: {
        cat: null,
        largeCat: true
      }
    },
    third: { type: 'cat' }
  },
  collections: {
    title: { text: 'collections' },
    collection: { type: 'collection' }, // this is def wrong
    text: { $: 'field' },
    collection2: { type: 'collection' } // this is def wrong
  }
}, state))

state.greeting.set('bye')
global.state = state
