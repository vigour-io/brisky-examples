'use strict'
module.exports = function createData (rows) {
// generate some dummy data
  const data = { databases: {} }
  for (let i = 0, name; i <= rows; i++) {
    name = 'cluster' + i
    setRow(data, name)
    setRow(data, name + 'slave')
  }
  return data
}

function setRow (data, name) {
  const info = data.databases[name] = {
    queries: []
  }
  const r = Math.floor(Math.random() * 5 + 1)
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
  info.queries = info.queries.sort(
    (a, b) => a && b ? b.elapsed - a.elapsed : 0
  )
  info.length = len
}
