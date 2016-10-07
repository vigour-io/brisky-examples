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
  title: { tag: 'h1', text: 'todos' },
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
              [Date.now()]: { text: e.target.value } // Question: Why add Date.now()?
            }
          }, stamp) // Store new item w/ text in state.
          e.target.value = '' // Reset value after adding a todo.
        }
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
    label: {
      tag: 'label',
      text: { $: 'text' },
      class: {
        linethrough: { $: 'done' }
      }
    },
    destroy: {
      tag: 'button',
      class: 'destroy',
      on: {
        click: (e, stamp) => e.state.remove(stamp) // Delete item from state
      }
    }
  }
}

const footer = {
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
        class: 'selected',
        on: {
          click: (e, stamp) => e.state.set({ selectedFilter: 'all' }, stamp)
        }
      }
    },
    active: {
      href: {
        text: 'Active',
        on: {
          click: (e, stamp) => e.state.set({ selectedFilter: 'active' }, stamp)
        }
      }
    },
    completed: {
      href: {
        text: 'Completed',
        on: {
          click: (e, stamp) => e.state.set({ selectedFilter: 'completed' }, stamp)
        }
      }
    }
  }
}

const todoapp = {
  types: { header },
  header: { type: 'header' },

  // Do not render main if no todos are in state.

  main: {
    // $: 'todos.item.$test', // state && state.compute()

    tag: 'section',
    toggle: {
      tag: 'input',
      props: { type: 'checkbox' },
      class: 'toggle-all',
      on: {
        click: (e, stamp) => {
          const checkAllItems = e.state.root.get('checkAllItems')
          const itemsChecked = checkAllItems ? checkAllItems.val : false

          e.state.set({ checkAllItems: itemsChecked ? false : true }, stamp)
          e.state.get('todos', {}).each((p) => { // Depending on boolean checkAllItems, toggle items.
            p.set({ done: itemsChecked ? false : true }, stamp)
          })

          console.log('Event: %O || Stamp: %O', e, stamp)
        }
      }
    },
    list: {
      tag: 'ul',
      class: 'todo-list',
      $: 'todos.$any',
      child: item // Whenever todos are added to state, spawn item in DOM.
    }
  },
  footer
}

const app = {
  child: { class: true, child: 'Constructor' },
  todoapp
}

// Add app to DOM, initialize render:
document.body.appendChild(render(app, state))

/**
 * Debugging - Spawn 3 items:
 **/

// let object = { todos: {} }
// let iteration = 0
// for (iteration = 0; iteration < 3; iteration++) {
//   object.todos[iteration] = { text: 'todo it' }
// }
// state.set(object)
