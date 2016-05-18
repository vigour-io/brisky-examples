'use strict'
const http = require('http')
const s = require('vigour-state/s')
const state = module.exports = s({
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
      val: global.localStorage.movie,
      on: {
        data () {
          global.localStorage.movie = this.serialize().val
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
