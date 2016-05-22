'use strict'
require('../style.css')
const nav = require('dom-nav')
// const vstamp = require('vigour-stamp')

module.exports = {
  key: 'app',
  text: {
    $: 'movies.items',
    $transform (val) {
      return 'movies total:' + val.keys().length +
      ' dom nodes total:' + document.getElementsByTagName('*').length
    }
  },
  filters: {
    class: 'holder',
    filter: {
      class: 'complex-item',
      slider: {
        tag: 'input',
        props: {
          type: 'range',
          min: 0,
          max: 10,
          value: { $: 'rating' },
          step: 0.1
        },
        on: {
          input (data, stamp) {
            // stamp = vstamp.create(this.path().join('-'))
            data.state.set({ rating: data.target.value }, stamp)
            // vstamp.close(stamp)
          }
        }
      },
      rating: {
        class: 'basic-item',
        text: { $: 'rating' }
      }
    },
    search: {
      tag: 'input',
      class: 'title',
      $: 'query',
      props: {
        placeholder: 'search movies...',
        type: 'search',
        value: {
          $: true,
          $transform: (val) => typeof val === 'string' ? val : ''
        }
      },
      // focus: { $: '$root.focus' },
      on: {
        input (data, stamp) {
          data.state.getRoot().query.set(data.target.value, stamp)
        }
      //   change (data, stamp) {
      //     const rootstate = data.state.getRoot()
      //     const moviesfocus = rootstate.get('movies.focus', {})
      //     rootstate.focus.set(moviesfocus, stamp)
      //     moviesfocus.emit('data', stamp)
      //     if (document.activeElement === data.target) {
      //       data.target.parentNode.childNodes[2].firstChild.focus()
      //     }
      //   },
      //   arrowdown (data, stamp) {
      //     const rootstate = data.state.getRoot()
      //     const moviesfocus = rootstate.get('movies.focus', {})
      //     rootstate.focus.set(moviesfocus, stamp)
      //     moviesfocus.emit('data', stamp)
      //     if (document.activeElement === data.target) {
      //       data.target.parentNode.childNodes[2].firstChild.focus()
      //     }
      //   }
      }
    }
  },
  holder: {
    $: 'movies.items.$any',
    Child: {
      $: '$condition',
      class: 'complex-item poster-item',
      // focus: { $: '$parent.$parent.focus' },
      poster: {
        tag: 'img',
        props: {
          src: { $: 'poster' }
        }
      },
      title: { text: { $: 'title' } },
      year: {
        class: 'basic-item',
        text: { $: 'year' }
      },
      rating: {
        class: 'basic-item',
        text: { $: 'rating' }
      },
      votes: {
        class: 'basic-item',
        text: { $: 'votes', $prepend: 'votes: ' }
      },
      description: {
        class: 'nested',
        text: { $: 'description' }
      },
      $condition: {
        val (state) {
          const $root = state.getRoot()
          var query = $root.query && $root.query.compute()
          if (typeof query !== 'string') {
            query = false
          }
          var rating = $root.rating ? $root.rating.compute() : 0
          if (state.rating && state.rating.compute() < rating) {
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
            return titleResult || state.year && state.year.compute() === query
          }
        },
        $subs: {
          title: {},
          $root: { query: {}, rating: {} }
        }
      },
      on: {
        // keyup (e, stamp) {
        //   if (e.event.keyCode === 13) {
        //     this.emit('click', e, stamp)
        //   }
        // },
        // arrowup (data, stamp) {
        //   let target = nav.up(data.target)
        //   if (target) {
        //     target.focus()
        //   } else {
        //     data.state.getRoot().focus.set(data.state.getRoot().query, stamp)
        //   }
        // },
        // arrowdown (data) {
        //   let target = nav.down(data.target)
        //   if (target) { target.focus() }
        // },
        // arrowleft (data) {
        //   let target = nav.left(data.target)
        //   if (target) { target.focus() }
        // },
        // arrowright (data) {
        //   let target = nav.right(data.target)
        //   if (target) { target.focus() }
        // }
      }
    }
  }
}
