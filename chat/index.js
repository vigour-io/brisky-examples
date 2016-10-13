'use strict'
require('./style.css')
const render = require('brisky/render')
const s = require('vigour-state/s')
const state = global.state = s({})

const chatApp = {
  class: 'chat-application',
  main: {
    class: 'main-window',
    channels: {
      class: 'channel-window',
      title: {
        class: 'title',
        tag: 'h1',
        text: 'Brisky Chat ™'
      }
    },
    chat: {
      class: 'messages-window',
      messages: {

      },
      interaction: {
        class: 'interaction',
        input: {
          class: 'new-message',
          tag: 'input',
          props: {
            placeholder: 'Enter message...'
          }
        }
      }
    }
  }
}

const app = {
  chatApp
}

document.body.appendChild(render(app, state))
