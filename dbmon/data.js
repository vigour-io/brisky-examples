'use strict'
module.exports = function (rows) {
// generate some dummy data
  var data = {
    start_at: new Date().getTime() / 1000,
    databases: {}
  }

  for (var i = 1; i <= rows; i++) {
    data.databases['cluster' + i] = {
      queries: []
    }
    data.databases['cluster' + i + 'slave'] = {
      queries: []
    }
  }

  Object.keys(data.databases).forEach(function (dbname) {
    var info = data.databases[dbname]
    var r = Math.floor(Math.random() * 5 + 1)
    var len = 0
    for (var i = 0; i < 5; i++) {
      var q
      if (i <= r) {
        q = {
          elapsed: Math.random() * 15,
          query: 'SELECT blah FROM something',
          waiting: Math.random() < 0.5
        }
        if (Math.random() < 0.2) {
          q.query = '<IDLE> in transaction'
        }
        if (Math.random() < 0.1) {
          q.query = 'vacuum'
        }
        info.queries.push(q)
        len++
      } else {
        // q = null adds a wopping 35% slow-down
        q = {
          elapsed: '',
          query: '',
          waiting: 0
        }
        info.queries.push(q)
      }
    }
    info.queries = info.queries.sort(function (a, b) {
      return a && b ? b.elapsed - a.elapsed : 0
    })
    info.length = len
  })
  return data
}
