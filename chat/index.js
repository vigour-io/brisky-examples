'use strict'
require('./style.css')
const render = require('brisky/render')
const vstamp = require('vigour-stamp')
// const s = require('vigour-state/s')
const Hub = require('brisky-hub')
const state = global.state = new Hub({
  id: Math.random(),
  url: 'ws://morten.local:3031',
  user: { $type: 'string' }
})

console.log(state.id)

// chat screen

const rooms = {
  class: 'room-window',
  username: {
    $: '$root.users.$any',
    class: 'username-wrapper',
    child: {
      class: 'username',
      tag: 'a',
      text: { $: true }
    }
  },
  messageMenus: {
    $: '$root.channels',
    class: 'menu-wrapper',
    header: {
      class: 'header',
      title: {
        class: 'title',
        tag: 'h2',
        text: 'Channels:'
      }
    },
    list: {
      class: 'menu-list',
      tag: 'ul',
      item: {
        $: '$root.channels.$any',
        class: 'list-item',
        tag: 'li',
        child: {
          class: 'list-link',
          tag: 'a',
          text: { $: true }
        }
      }
    }
  }
}

const messageItem = {
  class: 'message',
  tag: 'li',
  text: '',
  username: {
    class: 'sent-username',
    tag: 'span',
    text: 'Jim'
  },
  time: {
    class: 'sent-time',
    tag: 'span',
    text: {
      $: 'time',
      $transform: data => {
        const time = new Date(data)
        const hours = formatTime(time.getHours())
        const minutes = formatTime(time.getMinutes())

        return `${hours}:${minutes}`
      }
    }
  },
  message: {
    class: 'sent-message',
    tag: 'p',
    text: { $: 'text' }
  }
}

function formatTime (value) {
  return (value < 10 ? `0${value}` : value)
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
              [vstamp.val(stamp)]: { time: Date.now(), text: e.target.value }
            }
          }, stamp)
          e.target.value = ''
        }
      }
    }
  }
}

// username screen

const user = {
  class: 'username-screen',
  wrapper: {
    class: 'set-username-wrapper',
    input: {
      class: 'set-username',
      tag: 'input',
      props: { placeholder: 'Set your username' },
      on: {
        enter: (e, stamp) => {
          const id = e.target.value
          e.state.root.set({
            users: { [id]: id },
            user: '$root.users.' + id
          }, stamp)
        }
      }
    }
  }
}

const app = {
  class: 'chat-application',
  $: 'user.$switch',
  $switch: state => state.compute() ? 'chat' : 'user',
  properties: {
    chat: {
      class: 'main-window',
      rooms,
      chat
    },
    user
  }
}

document.body.appendChild(render(app, state))
