'use strict'
require('vigour-util/require')() // fix for css requires in node
require('./benchmark.css')
const render = require('brisky/render')
const State = require('vigour-state')
const isNumber = require('vigour-util/is/number')
const raf = global.requestAnimationFrame || process.nextTick

exports.ui = {
  class: { shiftdown: true },
  benchmark: {
    class: 'benchmark',
    init: {
      text: { $: 'first', $add: ' ms initial render' }
    },
    ms: {
      text: {
        $: 'ms',
        $transform (val) {
          return isNumber(val) ? Math.round(val) : 'not measured'
        },
        $add: ' ms periodic updates'
      }
    },
    update: {
      $: 'updating',
      text: {
        $: true,
        $transform: (val) => val === true ? 'updating' : 'paused'
      },
      on: {
        click (e, stamp) {
          e.state.set(!e.state.val, stamp)
        }
      }
    },
    elems: {
      text: { $: 'elems', $add: ' dom-nodes' }
    }
  }
}

exports.init = function (amount, app, method, update, state) {
  app.inject = exports.ui
  if (state) {
    if (state.isState) {
      state.set({
        collection: { sync: false },
        elems: { sync: false },
        ms: { sync: false }
      }, false)
    } else {
      state.collection = {}
      state.ms = {}
    }
  } else {
    state = { collection: {}, ms: {} }
  }
  for (let i = 0; i < amount; i++) {
    state.collection[i] = method(i, 0)
  }
  if (!state.isState) {
    state = new State(state, false)
  }
  if (update) { update(state, 0) }
  var ms = Date.now()
  if (document.body) {
    document.body.appendChild(render(app, state))
    state.set({ first: { val: Date.now() - ms, sync: false } })
    state.set({ elems: document.getElementsByTagName('*').length })
  }
  return state
}

exports.loop = function (amount, app, method, update, passState) {
  setTimeout(function () {
    const state = exports.init(amount, app, method, update, passState)
    var cnt = 0
    var total = 0
    if (!state.updating) {
      state.set({ updating: true })
    }
    function loop () {
      if (state.updating.val === true) {
        cnt++
        var ms = Date.now()
        if (!update) {
          var obj = {}
          for (let i = 0; i < amount; i++) {
            obj[i] = method(i, cnt)
          }
          state.collection.set(obj)
        } else {
          update(state, cnt, amount)
        }
        if (!state.first) {
          state.set({ first: Date.now() - ms })
        } else {
          total += (Date.now() - ms)
          state.ms.set(total / cnt)
        }
      }
      raf(loop)
    }
    // state.collection[0].remove()
    loop()
  })
}
