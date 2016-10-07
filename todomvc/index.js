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
    text: 'X items left'

    // text: {
    //  $: 'todos.items',
    //  $transform: val => {
    //    return `todos completed`
    //  }
    // }

    // text: {
    //   $: 'todos.$any',
    //   $transform: (val) => {
    //     // `${todos.length()} items left`
    //     // e.state.get('todos', {}).each((p) => {
    //     // })
    //   }
    // }

  },
  child: {
    on: {
      click () {
        // alert(this.parent.key)
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
          click: (e, stamp) => {
            console.log(e)
          }
        }
      }
    },
    active: {
      href: {
        text: 'Active',
        on: {
          click: (e, stamp) => {
            console.log(e)
          }
        }
      }
    },
    completed: {
      href: {
        text: 'Completed',
        on: {
          click: (e, stamp) => {
            console.log(e)
          }
        }
      }
    }
  }
}

const todoapp = {
  types: { header },
  header: { type: 'header' },
  main: {
    tag: 'section',
    // $: 'allChecked.$any',
    toggle: {
      tag: 'input',
      props: { type: 'checkbox' },
      class: 'toggle-all',
      on: {
        click: (e, stamp) => {
          // e.state.set({ allChecked: true }, stamp)

          e.state.get('todos', {}).each((p) => {
            p.set({ done: true }, stamp)
          })

          console.log('Event: %O // Stamp: %O', e, stamp)
        }
      }
    },
    list: {
      tag: 'ul',
      class: 'todo-list',

      // Whenever todos are added to state, add item to DOM.

      $: 'todos.$any',
      child: item
    }
  },
  footer
}

const app = {
  child: { class: true, child: 'Constructor' },
  todoapp
}

document.body.appendChild(render(app, state))

// Benchmarking code:
var d = Date.now()
var obj = { todos: {} }
for (var i = 0; i < 10; i++) {
  obj.todos[i] = { text: 'todo it ' }
}
state.set(obj)

// var obj = { todos: {} }
// for(var i = 0; i < 1e3; i++) {
//   obj.todos[i] = { done: true }
// }
// state.set(obj)

// state.todos.remove()

console.log(Date.now() - d, 'ms')

