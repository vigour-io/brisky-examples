'use strict'
require('./style.css')
const render = require('brisky/render')
const s = require('vigour-state/s')
const state = global.state = s({})

const chatApp = {
  class: 'chat-application',
  main: {
    class: 'main-window',
    chat: {
      class: 'messages-window'
    },
    activeUsers: {
      class: 'active-users-window'
    }
  },
  input: {
    tag: 'input',
    class: 'new-message'
  }
}

const app = {
  child: { class: true, child: 'Constructor' },
  chatApp
}

document.body.appendChild(render(app, state))
