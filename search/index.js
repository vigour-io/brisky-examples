'use strict'
require('../style.css')
const s = require('vigour-state/s')
const render = require('brisky/render')
const nav = require('dom-nav')
const http = require('http')

require('brisky').prototype.set({
  properties: {
    $condition: true
  }
})

const elem = {
  key: 'app',
  text: 'search',
  search: {
    node: 'input',
    class: 'title',
    $: 'query',
    props: {
      placeholder: 'search movies...',
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
      class: 'complex-item',
      focus: { $: '$parent.$parent.focus' },
      poster: {
        node: 'img',
        props: { src: { $: 'poster' } }
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
            state.focus.set(state.query, stamp)
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

const state = global.state = s({
  title: 'search app',
  query: {
    on: {
      data () {
        const val = this.compute()
        global.localStorage.query = val
        http.get(`http://www.omdbapi.com/?s=${val}&r=json&type=movie`, (res) => {
          var data = ''
          res.on('data', (chunk) => { data += chunk })
          res.on('end', () => {
            data = JSON.parse(data)
            if (!data.Error) {
              data = data.Search
              let payload = {}
              for (let i = 0, len = data.length; i < len; i++) {
                let movie = data[i]
                payload[movie.imdbID] = {
                  title: movie.Title,
                  poster: movie.Poster,
                  year: movie.Year
                }
              }
              state.set({ movies: { items: payload } })
            }
          })
        })
      }
    }
  },
  movies: {
    title: 'movies list!',
    focus: {
      val: global.localStorage.focusMovie,
      on: {
        data () {
          global.localStorage.focusMovie = this.serialize().val
        }
      }
    }
  },
  focus: {
    val: global.localStorage.focus || '$root.query',
    on: {
      data () {
        global.localStorage.focus = this.serialize().val
      }
    }
  }
})

state.query.set(global.localStorage.query || '')
document.body.appendChild(render(elem, state))
