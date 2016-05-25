'use strict'
const Hub = require('vigour-hub')
const http = require('http')
const url = 'http://api.themoviedb.org/3/'
const apikey = '&api_key=7049bfd41c073cdc48a026969d0cb3e1'
const hub = global.hub = new Hub({
  port: 3031,
  title: 'hub',
  query: {
    on: {
      data () {
        const val = this.compute()
        getMovies(`${url}search/movie?query=${val}${apikey}`, hub)
      }
    }
  },
  movies: {
    title: 'movies list!'
  },
  focus: {
    val: '$root.query'
  }
})

var i = 0
function discover () {
  i++
  if (i < 100) {
    console.log('discover movies', i)
    getMovies(`${url}discover/movie?sort_by=popularity.desc&page=${i}${apikey}`, hub, discover)
  }
}
discover()

console.log('hub listening on 3031', hub)

function getMovies (url, hub, next) {
  http.get(url, (res) => {
    var data = ''
    res.on('data', (chunk) => { data += chunk })
    res.on('end', () => {
      data = JSON.parse(data)
      if (!data.Error) {
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
        hub.set({ movies: { items: payload } })
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
