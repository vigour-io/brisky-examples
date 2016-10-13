'use strict'
require('./style.css')
const render = require('brisky/render')
const s = require('vigour-state/s')
const state = global.state = s({
  messageMenus: [ 'Rooms', 'Messages' ]
})

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
        text: 'fo shizzle my nizzle'
      }
    }
  }
}

const rooms = {
  class: 'room-window',
  title: {
    class: 'main-title',
    tag: 'h1',
    text: 'Brisky Chat ™'
  },
  username: {
    class: 'username',
    tag: 'a',
    text: 'John Doe'
  },
  $: '$root.messageMenus.$any',
  child: listMenu
}

const messageItem = {
  class: 'message',
  tag: 'li',
  text: '',
  time: {
    tag: 'span',
    text: {
      $: 'time',
      $transform: data => {
        console.log('data: %O', data)
        return ''
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
              [Date.now()]: { time: Date.now(), text: e.target.value }
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
    rooms,
    chat
  }
}

const app = {
  chatApp
}

document.body.appendChild(render(app, state))

// let object = { messages: {} }
// let iteration
// for (iteration = 0; iteration < 3; iteration++) {
//   object.messages[iteration] = { text: `message` }
// }
// state.set(object)
