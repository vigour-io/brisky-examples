'use strict'
require('./style.css')
const render = require('brisky/render')
const s = require('vigour-state/s')
const state = global.state = s({})

const channelItem = {
  class: 'list-item',
  tag: 'li',
  link: {
    class: 'list-link',
    tag: 'a',
    text: 'fo shizzle'
  }
}

const channels = {
  class: 'channel-window',
  title: {
    class: 'title',
    tag: 'h1',
    text: 'Brisky Chat ™'
  },
  available: {
    class: 'channels-menu',
    header: {
      class: 'header',
      title: {
        class: 'title',
        tag: 'h2',
        text: 'Channels:'
      }
    },
    list: {
      class: 'channels-list',
      tag: 'ul',
      channelItem
    }
  }
}

const messageItem = {
  class: 'message',
  tag: 'li',
  text: { $: 'text' }
}

const chat = {
  class: 'messages-window',
  messages: {
    class: 'messages',
    $: 'messages.$any',
    tag: 'ul',
    child: messageItem
  },
  interaction: {
    class: 'interaction',
    input: {
      class: 'new-message',
      tag: 'input',
      props: { placeholder: 'Enter message...' },
      on: {
        enter: (e, stamp) => {
          e.state.set({
            messages: {
              [Date.now()]: { text: e.target.value }
            }
          }, stamp)
          e.target.value = ''
        }
      }
    }
  }
}

const chatApp = {
  class: 'chat-application',
  main: {
    class: 'main-window',
    channels,
    chat
  }
}

const app = {
  chatApp
}

document.body.appendChild(render(app, state))
