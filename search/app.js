'use strict'
require('../style.css')
// const vstamp = require('vigour-stamp')

module.exports = {
  key: 'app',
  child: {
    class: true,
    child: 'Constructor'
  },
  filters: {
    class: 'holder',
    search: {
      tag: 'input',
      class: 'title',
      props: { // --> attr or attributes
        placeholder: 'search movies...',
        type: 'search',
        value: { $: 'query' }
      },
      on: {
        input (e, stamp) {
          e.state.root.set({ query: e.target.value }, stamp)
        }
      }
    }
  },
  text: {
    $: 'movies.items',
    sync: false, // very important else val: true
    $transform: val => `movies in state: ${val.keys().length}`
  },
  holder: {
    $: 'movies.items.$any',
    child: {
      class: 'complex-item poster-item',
      $: '$test',
      // poster: {
      //   tag: 'img',
      //   props: {
      //     src: {
      //       $: 'poster',
      //       $transform: val => `https://vigour-4f98.kxcdn.com/409668-0/proxy=${encodeURI(val)}`
      //     }
      //   }
      // },
      title: {
        class: 'title',
        text: { $: 'title' }
      },
      // year: {
      //   class: 'basic-item',
      //   text: { $: 'year' }
      // },
      // rating: {
      //   class: 'basic-item',
      //   text: { $: 'rating' }
      // },
      // votes: {
      //   class: 'basic-item',
      //   text: { $: 'votes', $prepend: 'votes: ' }
      // },
      // description: {
      //   class: 'nested',
      //   text: { $: 'description' }
      // },
      $test: {
        val (state) {
          var $root = state.root
          var query = $root.query && $root.query.compute()
          if (typeof query !== 'string') {
            query = false
          }
          if (!query) {
            return true
          } else {
            var title = state.title && state.title.compute()
            if (typeof title !== 'string') {
              title = false
            }
            return title && title.toLowerCase().indexOf(query.toLowerCase()) !== -1
          }
        },
        $: {
          title: true,
          $root: { query: true }
        }
      }
    }
  }
}
