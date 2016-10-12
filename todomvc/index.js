'use strict'

/**
 *
 * TodoMVC for brisky-examples
 *
 **/

require('./style.css')

const render = require('brisky/render')
const s = require('vigour-state/s')
const state = global.state = s({
  filters: [ 'all', 'active', 'completed' ],
  checkAllItems: true
})

state.set({ selectedFilter: state.filters[0] })

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
          const itemsChecked = e.state.root.checkAllItems.compute()
          e.state.root.set({ checkAllItems: !itemsChecked }, stamp)
          e.state.each((item) => {
            if (item.done.val !== itemsChecked) {
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
  $: '$test',
  $test: {
    val: state => {
      const filter = state.root.selectedFilter.compute()
      if (filter === 'all') {
        return true
      } else {
        const done = state.done && state.done.compute()
        return (filter === 'active' && !done) || filter === 'completed' && done
      }
    },
    $: {
      $root: { selectedFilter: true },
      done: true
    }
  },
  class: {
    'list-item': true
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
  $: 'todos.$test',
  $test: state => state.keys().filter(val => state[val].val !== null).length,
  counter: {
    class: 'todo-count',
    tag: 'span',
    text: {
      $: true,
      $transform: data => {
        var count = 0
        data.each(item => {
          if (item.done.compute() === false) { count++ }
        })
        return `${count} items left`
      }
    }
  },
  filters: {
    tag: 'ul',
    $: '$root.filters.$any',
    child: {
      tag: 'li',
      class: 'filter-item',
      href: {
        tag: 'a',
        text: { $: true },
        class: {
          selected: {
            $: '$test',
            $test: {
              val: state => state.root.selectedFilter.origin() === state,
              $: {
                $root: { selectedFilter: true }
              }
            },
            $transform: true
          }
        },
        on: {
          click: (e, stamp) => e.state.root.set({ selectedFilter: e.state }, stamp)
        }
      }
    }
  },
  button: {
    $: '$test',
    tag: 'button',
    class: 'clear-completed',
    text: 'Clear completed',
    $test: state => state.keys().filter(key => state[key].done.compute()).length,
    on: {
      click: (e, stamp) => e.state.each(item => {
        if (item.done.compute()) { item.remove(stamp) }
      })
    }
  }
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

document.body.appendChild(render(app, state))

var d = Date.now()
let object = { todos: {} }
let iteration

for (iteration = 0; iteration < 1e2; iteration++) {
  object.todos[iteration] = { text: `Something to do ${iteration}`, done: false }
}
state.set(object)

for (iteration = 0; iteration < 1e2; iteration++) {
  object.todos[iteration] = { done: true }
}
state.set(object)

for (iteration = 0; iteration < 1e2; iteration++) {
  object.todos[iteration] = null
}
state.set(object)

console.log('Benchmark: ', Date.now() - d, 'ms')
