'use strict'
require('../style.css')
// const vstamp = require('vigour-stamp')

module.exports = {
  key: 'app',
  child: {
    class: true,
    child: 'Constructor'
  },
  // text: {
  //   $: 'movies.items',
  //   sync: false,
  //   $transform (val) {
  //     return val.keys().length
  //   }
  // },
  // text: {
  //   // non syncing again... / need to check what to do for this..
  //   $: 'movies.items',
  //   $transform: (val) => 'movies total:' + val.keys().length
  // },
  filters: {
    class: 'holder',
    // rating: {
    //   class: 'complex-item',
    //   slider: {
    //     tag: 'input',
    //     props: {
    //       type: 'range',
    //       min: 0,
    //       max: 10,
    //       value: { $: 'rating' },
    //       step: 0.1
    //     },
    //     on: {
    //       input (e, stamp) {
    //         // this way you can change the stamp name
    //         // stamp = vstamp.create(this.path().join('-'))
    //         e.state.set({ rating: e.target.value }, stamp)
    //         // vstamp.close(stamp)
    //       }
    //     }
    //   },
    //   rating: {
    //     class: 'basic-item',
    //     text: { $: 'rating' }
    //   }
    // },
    search: {
      tag: 'input',
      class: 'title',
      props: {
        placeholder: 'search movies...',
        type: 'search',
        value: {
          $: 'query',
          $transform: (val) => typeof val === 'string' ? val : ''
        }
      },
      on: {
        input (e, stamp) {
          e.state.getRoot().set({ query: e.target.value }, stamp)
        }
      }
    },
    // year: {
    //   tag: 'input',
    //   class: 'title',
    //   props: {
    //     placeholder: 'year...',
    //     type: 'search',
    //     value: {
    //       $: 'year',
    //       $transform: (val) => typeof val === 'string' ? val : ''
    //     }
    //   },
    //   on: {
    //     input (e, stamp) {
    //       e.state.getRoot().set({ year: e.target.value }, stamp)
    //     }
    //   }
    // }
  },
  holder: {
    $: 'movies.items.$any',
    child: {
      class: 'complex-item poster-item',
      $: '$test',
      // poster: {
      //   tag: 'img',
      //   props: {
      //     src: { $: 'poster' }
      //   }
      // },
      title: { text: { $: 'title' } },
      // substitle: { text: { $: '$root.xxx' } },
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
          // return true
          var $root = state.getRoot()
          var query = $root.query && $root.query.compute()
          if (typeof query !== 'string') {
            query = false
          }
          var rating = $root.rating ? $root.rating.compute() : 0
          if (state.rating && state.rating.compute() < rating) {
            return false
          }
          var year = $root.year && $root.year.compute()
          if (year && state.year && state.year.compute() !== year) {
            return false
          }
          if (!query) {
            return true
          } else {
            var title = state.title && state.title.compute()
            if (typeof title !== 'string') {
              title = false
            }
            const titleResult = title && title.toLowerCase().indexOf(query.toLowerCase()) !== -1
            return titleResult
          }
        },
        $: {
          title: {},
          year: {},
          $root: { query: {}, rating: {}, year: {} }
        }
      }
    }
  }
}
