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
  wrapper: {
    toggleAll: {
      $: 'todos.$test',
      $test: state => state.keys().filter(val => state[val].val !== null).length,
      tag: 'input',
      props: { type: 'checkbox' },
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
    newTodo: {
      tag: 'input',
      props: { placeholder: 'What needs to be done?' },
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

const todoItem = {
  $: '$test',
  tag: 'li',
  $test: {
    val: state => {
      const filter = state.root.selectedFilter.compute()
      if (filter === 'all') {
        return true
      } else {
        const done = state.done && state.done.compute()
        return (filter === 'active' && !done) || (filter === 'completed' && done)
      }
    },
    $: {
      $root: { selectedFilter: true },
      done: true
    }
  },
  class: {
    todoItem: true,
    completed: { $: 'done' }
  },
  view: {
    toggle: {
      tag: 'input',
      props: { type: 'checkbox' },
      on: {
        change: (e, stamp) => e.state.set({ done: e.target.checked }, stamp)
      }
    },
    destroy: {
      tag: 'button',
      on: {
        click: (e, stamp) => e.state.remove(stamp)
      }
    }
  },
  edit: {
    tag: 'input',
    props: { value: { $: 'text' } },
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
      class: 'filterItem',
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
  clearCompleted: {
    $: '$test',
    tag: 'button',
    text: 'Clear completed',
    $test: state => state.keys().filter(key => state[key].done.compute()).length,
    on: {
      click: (e, stamp) => e.state.each(item => {
        if (item.done.compute()) { item.remove(stamp) }
      })
    }
  }
}

const todoApp = {
  header,
  main: {
    tag: 'section',
    todoList: {
      $: 'todos.$any',
      tag: 'ul',
      child: todoItem
    }
  },
  footer
}

const app = {
  child: { class: true, child: 'Constructor' },
  title: { tag: 'h1', text: 'todos' },
  todoApp
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
