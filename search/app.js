'use strict'
require('../style.css')
const nav = require('dom-nav')
// const vstamp = require('vigour-stamp')

module.exports = {
  key: 'app',
  text: {
    $: 'movies.items',
    $transform: (val) => 'movies total:' + val.keys().length
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
          input (e, stamp) {
            // this way you can change the stamp name
            // stamp = vstamp.create(this.path().join('-'))
            e.state.set({ rating: e.target.value }, stamp)
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
      focus: { $: '$root.focus' },
      on: {
        input (e, stamp) {
          e.state.getRoot().set({ query: e.target.value }, stamp)
        },
        change (data, stamp) {
          this.emit('arrowdown', data, stamp)
        },
        arrowdown (data, stamp) {
          const rootstate = data.state.getRoot()
          const moviesfocus = rootstate.get('movies.focus', {})
          rootstate.set({ focus: moviesfocus }, stamp)
          moviesfocus.emit('data', void 0, stamp)
          if (document.activeElement === data.target) {
            data.target.parentNode.parentNode.childNodes[2].firstchild.focus()
          }
        }
      }
    }
  },
  holder: {
    $: 'movies.items.$any',
    child: {
      $: '$test',
      class: 'complex-item poster-item',
      focus: { $: '$parent.$parent.focus' },
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
      $test: {
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
        $: {
          title: {},
          $root: { query: {}, rating: {} }
        }
      },
      on: {
        keyup (e, stamp) {
          if (e.event.keyCode === 13) {
            this.emit('click', e, stamp)
          }
        },
        arrowup (e, stamp) {
          let target = nav.up(e.target)
          if (target) {
            target.focus()
          } else {
            e.state.getRoot().set({ focus: e.state.getRoot().query }, stamp)
          }
        },
        arrowdown (e) {
          let target = nav.down(e.target)
          if (target) { target.focus() }
        },
        arrowleft (e) {
          let target = nav.left(e.target)
          if (target) { target.focus() }
        },
        arrowright (e) {
          let target = nav.right(e.target)
          if (target) { target.focus() }
        }
      }
    }
  }
}
