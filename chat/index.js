'use strict'
require('./style.css')
const render = require('brisky/render')
const vstamp = require('vigour-stamp')
const s = require('vigour-state/s')
const state = global.state = s({
  messageMenus: [ 'Rooms', 'Messages' ],
  user: { $type: 'string' }
})

// chat screen

const listMenu = {
  class: 'menu-wrapper',
  header: {
    $: true,
    class: 'header',
    title: {
      class: 'title',
      tag: 'h2',
      text: { $: true }
    }
  },
  list: {
    class: 'menu-list',
    tag: 'ul',
    item: {
      class: 'list-item',
      tag: 'li',
      link: {
        class: 'list-link',
        tag: 'a',
        text: 'menu-text...'
      }
    }
  }
}

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
    $: '$root.messageMenus.$any',
    child: listMenu
  }
}

const messageItem = {
  class: 'message',
  tag: 'li',
  text: '',
  time: {
    class: 'sent-time',
    tag: 'span',
    text: {
      $: 'time',
      $transform: data => {
        console.log('data: %O', data)
        return '12:00'
      }
    }
  },
  message: {
    tag: 'span',
    text: { $: 'text' }
  }
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

// let object = { messages: {} }
// let iteration
// for (iteration = 0; iteration < 3; iteration++) {
//   object.messages[iteration] = { text: `message` }
// }
// state.set(object)
