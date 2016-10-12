'use strict'

/**
 *
 * TodoMVC for brisky-examples
 *
 **/

require('./style.css')

const render = require('brisky/render')
const s = require('vigour-state/s')
const state = global.state = s({})

// --- Use below to add connectivity:
// const Hub = require('brisky-hub')
// const state = global.state = new Hub({ url: 'ws://localhost:3030' })

const header = {
  class: 'header',
  wrapper: {
    toggle: {
      $: 'todos',
      tag: 'input',
      props: { type: 'checkbox' },
      class: 'toggle-all',
      on: {
        click: (e, stamp) => {
          const itemsChecked = e.state.root.get('checkAllItems') ? e.state.root.get('checkAllItems').val : true
          e.state.root.set({ checkAllItems: !itemsChecked }, stamp)
          e.state.each((item) => {
            if (item.get('done').val !== itemsChecked) {
              item.set({ done: itemsChecked }, stamp)
            }
          })
        }
      }
    },
    input: {
      tag: 'input',
      class: 'new-todo',
      props: {
        placeholder: 'What needs to be done?'
      },
      on: {
        blur: clearInputField,
        enter: (e, stamp) => {
          if (e.target.value) {
            e.state.set({
              todos: {
                [Date.now()]: { text: e.target.value, done: false }
              }
            }, stamp)
            clearInputField(e)
          }
        }
      }
    }
  }
}

function clearInputField (e) {
  e.target.value = ''
}

const item = {
  tag: 'li',
  class: {
    hidden: {
      $: 'done',
      $transform: (val) => {
        const filterType = state.root.get('selectedFilter').val
        switch (filterType) {
          case 'all':
            return false
          case 'active':
            return val
          case 'completed':
            return !val
        }
      }
    }
  },
  view: {
    toggle: {
      tag: 'input',
      class: {
        checked: { $: 'done' }
      },
      props: { type: 'checkbox' },
      on: {
        change: (e, stamp) => e.state.set({ done: e.target.checked }, stamp)
      }
    },
    destroy: {
      tag: 'button',
      class: 'destroy',
      on: {
        click: (e, stamp) => e.state.remove(stamp)
      }
    }
  },
  edit: {
    tag: 'input',
    class: {
      done: { $: 'done' }
    },
    props: {
      value: { $: 'text' }
    },
    on: {
      enter: setTodoText,
      blur: setTodoText
    }
  }
}

function setTodoText (e, stamp) {
  e.state.set({ text: e.target.value }, stamp)
  e.target.blur()
}

const footer = {
  $: '$test',
  $test: (state) => {
    return state.todos && state.todos.compute()
  },
  counter: {
    class: 'todo-count',
    tag: 'span',
    text: {
      $: 'todos',
      $transform: (data) => {
        let count = data.keys().length
        data.each((item) => {
          if (item.done.compute()) {
            count--
          }
        })

        return `${count} items left`
      }
    }
  },
  filters: {
    tag: 'ul',
    child: {
      tag: 'li',
      href: { tag: 'a' }
    },
    all: {
      href: {
        text: 'All',
        class: {
          selected: {
            $: 'selectedFilter',
            $transform: (val) => (val === 'all')
          }
        },
        on: {
          click: (e, stamp) => e.state.set({ selectedFilter: 'all' }, stamp)
        }
      }
    },
    active: {
      href: {
        text: 'Active',
        class: {
          selected: {
            $: 'selectedFilter',
            $transform: (val) => (val === 'active')
          }
        },
        on: {
          click: (e, stamp) => e.state.set({ selectedFilter: 'active' }, stamp)
        }
      }
    },
    completed: {
      href: {
        text: 'Completed',
        class: {
          selected: {
            $: 'selectedFilter',
            $transform: (val) => (val === 'completed')
          }
        },
        on: {
          click: (e, stamp) => e.state.set({ selectedFilter: 'completed' }, stamp)
        }
      }
    }
  },
  button: {
    $: '$test',
    tag: 'button',
    class: 'clear-completed',
    text: 'Clear completed',
    $test: checkForCompletedTodos,
    on: {
      click: (e, stamp) => {
        e.state.todos.each((item, stamp) => {
          if (item.done.compute()) {
            item.remove(stamp)
          }
        })
      }
    }
  }
}

function checkForCompletedTodos (state) {
  let completedTodosExist = false
  var todos = state.todos && state.todos.compute()
  if (todos) {
    state.todos.each((item) => {
      if (item.done.compute()) {
        completedTodosExist = true
      }
    })
  }

  return completedTodosExist
}

const todoapp = {
  class: 'todo-app',
  header,
  main: {
    tag: 'section',
    list: {
      $: 'todos.$any',
      tag: 'ul',
      class: 'todo-list',
      child: item
    }
  },
  footer
}

const app = {
  child: { class: true, child: 'Constructor' },
  title: { tag: 'h1', text: 'todos' },
  todoapp
}

let selectedFilter = { selectedFilter: 'all' }
state.set(selectedFilter)

// Add app to DOM, initialize render:
document.body.appendChild(render(app, state, function (subs, tree, state, type, stamp, nsubs, ntree, sType, elem) {
  // console.log('subscriptions: %O', subs)
  // console.log('state: %O', state)
}))

/**
 * Debugging - Spawn 3 items:
 **/

// let object = { todos: {} }
// let iteration = 0
// for (iteration = 0; iteration < 3; iteration++) {
//   object.todos[iteration] = { text: 'lets do this', done: false }
// }
// state.set(object)
