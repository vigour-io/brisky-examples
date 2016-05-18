'use strict'
require('../style.css')
const render = require('brisky/render')
const nav = require('dom-nav')

const elem = {
  key: 'app',
  text: 'search',
  search: {
    node: 'input',
    class: 'title',
    $: 'query',
    props: {
      placeholder: 'search movies...',
      type: 'search',
      value: { $: true }
    },
    focus: { $: '$root.focus' },
    on: {
      input (data, stamp) {
        data.state.getRoot().query.set(data.target.value, stamp)
      },
      change (data, stamp) {
        const rootstate = data.state.getRoot()
        const moviesfocus = rootstate.movies.focus
        rootstate.focus.set(moviesfocus, stamp)
        moviesfocus.emit('data', stamp)
        if (document.activeElement === data.target) {
          data.target.parentNode.childNodes[2].firstChild.focus()
        }
      },
      arrowdown (data, stamp) {
        const rootstate = data.state.getRoot()
        const moviesfocus = rootstate.movies.focus
        rootstate.focus.set(moviesfocus, stamp)
        moviesfocus.emit('data', stamp)
        if (document.activeElement === data.target) {
          data.target.parentNode.childNodes[2].firstChild.focus()
        }
      }
    }
  },
  holder: {
    $: 'movies.items.$any',
    Child: {
      $: '$condition',
      class: 'complex-item poster-item',
      focus: { $: '$parent.$parent.focus' },
      poster: {
        node: 'object',
        props: {
          data: { $: 'poster' },
          type: 'image/jpg'
        },
        symbol: {}
      },
      title: { text: { $: 'title' } },
      text: { $: 'year' },
      $condition: {
        val (state) {
          const query = state.getRoot().query.compute()
          if (!query) {
            return true
          } else {
            const title = state.title && state.title.compute()
            return title && title.toLowerCase().indexOf(query.toLowerCase()) !== -1
          }
        },
        $subs: {
          title: {},
          $root: { query: {} }
        }
      },
      on: {
        click (e, stamp) {
          global.location = 'http://www.imdb.com/title/' + e.state.key
        },
        keyup (e, stamp) {
          if (e.event.keyCode === 13) {
            this.emit('click', e, stamp)
          }
        },
        arrowup (data, stamp) {
          let target = nav.up(data.target)
          if (target) {
            target.focus()
          } else {
            data.state.getRoot().focus.set(data.state.getRoot().query, stamp)
          }
        },
        arrowdown (data) {
          let target = nav.down(data.target)
          if (target) { target.focus() }
        },
        arrowleft (data) {
          let target = nav.left(data.target)
          if (target) { target.focus() }
        },
        arrowright (data) {
          let target = nav.right(data.target)
          if (target) { target.focus() }
        }
      }
    }
  }
}

document.body.appendChild(render(elem, require('./state')))
