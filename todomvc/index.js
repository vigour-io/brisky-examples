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
          let itemsChecked = true
          if (e.state.root.get('checkAllItems')) {
            itemsChecked = e.state.root.get('checkAllItems').val
          }

          e.state.root.set({ checkAllItems: !itemsChecked }, stamp)
          e.state.root.get('todos', {}).each((item) => { // Depending on boolean checkAllItems, toggle items.
            item.set({ done: itemsChecked }, stamp)
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
        enter: (e, stamp) => {
          if (e.target.value) {
            e.state.set({
              todos: {
                [Date.now()]: { text: e.target.value, done: false } // Question: Why add Date.now()?
              }
            }, stamp) // Store new item w/ text in state.
            e.target.value = '' // Reset value after adding a todo.
          }
        },
        blur: (e) => e.target.value = ''
      }
    }
  }
}

const item = {
  tag: 'li',
  view: {
    class: 'view',
    toggle: {
      tag: 'input',
      class: 'toggle',
      props: {
        type: 'checkbox',
        checked: {
          $: 'done',
          $transform: (val) => val || null // Either add or remove checked attribute.
        }
      },
      on: {
        change: (e, stamp) => e.state.set({ done: e.target.checked }, stamp) // Boolean, either done or not.
      }
    },
    destroy: {
      tag: 'button',
      class: 'destroy',
      on: {
        click: (e, stamp) => e.state.remove(stamp) // Delete item from state
      }
    }
  },
  edit: {
    class: {
      done: { $: 'done' }
    },
    tag: 'input',
    props: {
      value: { $: 'text' },
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
  counter: {
    class: 'todo-count',
    tag: 'span',
    text: {
      $: 'todos',
      $transform: () => {
        let count = 0
        state.get('todos', {}).each((item) => {
          if (!item.get('done', false).compute()) {
            count++
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
        e.state.get('todos', {}).each((item, stamp) => {
          if (item.get('done', true).compute()) {
            item.remove(stamp)
          }
        })
      }
    }
  },
  $test: (state) => {
    return state.todos && state.todos.compute()
  },
}

function checkForCompletedTodos (state) {
  let completedTodosExist = false
  var todos = state.todos && state.todos.compute()
  if (todos) {
    state.get('todos', {}).each((item) => {
      if (item.get('done', true).compute()) {
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
      $: 'todos.$any', // only add item if todo exists in state
      tag: 'ul',
      class: 'todo-list',
      child: item // Whenever todos are added to state, spawn item in DOM.
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
  // console.log('subscriptions:', subs)
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
