'use strict'
require('./style.css')
const render = require('brisky/render')
const s = require('vigour-state/s')
const state = global.state = s({})

const chatApp = {
  class: 'chat-application',
  header: {
    class: 'header',
    title: {
      class: 'title',
      tag: 'h1',
      text: 'Brisky Chat ™'
    }
  },
  main: {
    class: 'main-window',
    chat: {
      class: 'messages-window'
    },
    activeUsers: {
      class: 'active-users-window'
    }
  },
  interaction: {
    class: 'interaction',
    input: {
      class: 'new-message',
      tag: 'input',
      props: {
        placeholder: 'Enter message...'
      }
    },
    button: {
      class: 'send-message',
      tag: 'button',
      text: 'Send'
    }
  }
}

const app = {
  chatApp
}

document.body.appendChild(render(app, state))
