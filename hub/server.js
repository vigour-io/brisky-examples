'use strict'
const Hub = require('vigour-hub')
const http = require('http')
const hub = new Hub({
  port: 3031,
  title: 'hub',
  query: {
    val: '',
    on: {
      data () {
        const val = this.compute()
        console.log('LOAD QEURY ---> ', val)
        http.get(`http://www.omdbapi.com/?s=${val}&r=json&type=movie`, (res) => {
          console.log('COMPLETE!', val)
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
              console.log('here datax', payload)
              hub.set({ movies: { items: payload } })
              console.log(hub.movies.items.length)
            }
          })
        })
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

console.log('hub listening on 3031', hub)
