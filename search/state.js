'use strict'
const http = require('http')
const url = 'http://api.themoviedb.org/3/'
const apikey = '&api_key=7049bfd41c073cdc48a026969d0cb3e1'
const fs = require('fs')
const path = require('path')
const cachePath = path.join(__dirname, '/cache')

module.exports = {
  title: 'hub',
  query: {
    // val: '',
    on: {
      data () {
        const val = this.compute()
        getMovies(`${url}search/movie?query=${val}${apikey}`, this.parent)
      }
    }
  },
  movies: {
    title: 'movies list!'
  },
  focus: {
    val: '$root.query'
  },
  define: {
    init (cache) {
      if (cache) {
        fs.exists(cachePath, exists => exists
          ? this.getMoviesFromCache()
          : this.getMovies()
        )
      } else {
        this.getMovies()
      }
    },
    getMoviesFromCache () {
      const cache = fs.createReadStream(cachePath)
      const state = this
      var obj = ''
      cache.on('data', chunk => {
        console.log('data')
        chunk = chunk.toString()

        console.log(chunk.slice(0, 20))
        var next, prev
        const index = chunk.indexOf('{"page":')

        if (obj && index !== -1) {
          next = chunk.slice(index)
          prev = chunk.slice(0, index - 1)
          console.log('index', index)
          obj += prev
          if (obj) {
            console.log('parse page')
            parseMovies(JSON.parse(obj), state)
          }
        }
        obj = next || chunk
      })
      cache.on('end', () => {
        console.log('END')
        parseMovies(JSON.parse(obj), state)
        obj = ''
      })
    },
    getMovies () {
      // const cache = fs.createWriteStream(cachePath)
      const state = this
      var i = 0
      function discover () {
        i++
        if (i < 300) {
          console.log('discover movies', i)
          getMovies(`${url}discover/movie?sort_by=popularity.desc&page=${i}${apikey}`, state, discover)
        }
      }
      discover()
    }
  }
}

function parseMovies (data, state) {
  data = data.results
  let payload = {}
  for (let i = 0, len = data && data.length || 0; i < len; i++) {
    let movie = data[i]
    if (
      movie.popularity > 1 &&
      movie.vote_average > 0 &&
      movie.release_date &&
      movie.vote_count > 10
    ) {
      payload[movie.id] = {
        title: movie.title,
        description: movie.overview,
        poster: `http://image.tmdb.org/t/p/w500/${movie.poster_path}?api_key=7049bfd41c073cdc48a026969d0cb3e1`,
        rating: movie.vote_average,
        votes: movie.vote_count,
        popularity: movie.popularity,
        language: movie.original_language,
        year: movie.release_date && movie.release_date.split('-')[0]
      }
    }
  }
  state.set({ movies: { items: payload } })
}

function getMovies (url, state, next, cache) {
  http.get(url, res => {
    var data = ''
    res.on('data', chunk => {
      // cache.write(chunk)
      data += chunk
    })
    res.on('end', () => {
      data = JSON.parse(data)
      if (!data.Error) {
        parseMovies(data, state)
        if (next) { next() }
      }
    })
  })
}

/*
poster sizes
"w92",
"w154",
"w185",
"w342",
"w500",
"w780",
*/
