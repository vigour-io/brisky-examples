/**
 *
 * TodoMVC for brisky-examples
 *
 **/

require('./style.css')

const render = require('brisky/render')
const s = require('vigour-state/s')
const Hub = require('brisky-hub')
const state = global.state = s({})
//const state = global.state = new Hub({ url: 'ws://localhost:3030' })

/*

Dirtydo-do:

- Add filtering options.
- Fix global done checkbox.

*/

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

          // Store new item w/ text in state.
          e.state.set({ 
            todos: {
              [Date.now()]: { text: e.target.value }
            }
          }, stamp)

          // Reset value after adding todo.
          e.target.value = ''

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

          // If item is done, set checked to true.
          $transform: (val) => val || null

        }
      },
      on: {

        // Boolean, either done or not.
        change: (e, stamp) => e.state.set({ done: e.target.checked }, stamp)
      }
    },
    label: {
      tag: 'label',
      text: { $: 'text' },
      class: {
       strikethrough: { $: 'done' }
      },
      // Subscribe to corresponding item in state
      // if done, add class 'strikethrough', etc.
    },
    destroy: {
      tag: 'button',
      class: 'destroy',
      on: {

        // Delete item from state when clicked.∏π∏
        click: (e, stamp) => e.state.remove(stamp)

      }
    }
  }
}

const footer = {
  counter: {
    class: 'todo-count',
    tag: 'span',

    // Subscribe to amount of items in state
    // show total + ' items left'

    text: {
      $: 'done',
      $transform: (val) => {

        // `${todos.length()} items left`

        e.state.get('todos', {}).each((p) => {
          
        })

      }
    },

  },
  child: {
    on: {
      click () {
        // alert(this.parent.key)
      }
    }
  },

  // Add filtering options.
  // When active is clicked, done items needs hidden class.
  // When completed is clicked, invert.
  // For all, remove hidden class completely.

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

            console.log(e);

            e.state.set({ 
              filter: {
                [Date.now()]: { 
                  selected: true
                }
              }
            }, stamp)

            
          }
        }
      } 
    },
    active: { href: { text: 'Active' } },
    completed: { href: { text: 'Completed' } }
  }
}

const todoapp = {
  types: { header },
  header: { type: 'header' },
  main: {
    tag: 'section',
    toggle: {
      tag: 'input',
      props: { type: 'checkbox' },
      class: 'toggle-all',
      on: {
        click: (e, stamp) => {

          console.log('Event: %O // Stamp: %O', e, stamp);

          e.state.get('todos', {}).each((p) => {
            p.set({ done: true }, stamp)
          })

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

var d = Date.now()
var obj = { todos: {} }
for(var i = 0; i < 10; i++) {
  obj.todos[i] = { text: 'todo it ' + i, ref: state.morten }
}
state.set(obj)
// var obj = { todos: {} }
// for(var i = 0; i < 1e3; i++) {
//   obj.todos[i] = { done: true }
// }
// state.set(obj)

// state.todos.remove()

console.log(Date.now() - d, 'ms')

