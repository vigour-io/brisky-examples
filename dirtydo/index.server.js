require('./style.css')

const render = require('brisky/render')
// const s = require('vigour-state/s')
const Hub = require('brisky-hub')

const state = global.state = new Hub({ url: 'ws://localhost:3030' })

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
					$transform: (val) => val || null
				}
			},
			on: {
				change: (e, stamp) => e.state.set({ done: e.target.checked }, stamp)
			}
		},
		label: {
			tag: 'label',
			text: { $: 'text' }
		},
		destroy: {
			tag: 'button',
			class: 'destroy',
			on: {
				click: (e, stamp) => e.state.remove(stamp)
			}
		}
	}
}

const header = {
	class: 'header',
	title: { tag: 'h1', text: 'Dirtydo app' },
	input: {
		tag: 'input',
		class: 'new-todo',
		props: {
			placeholder: 'What needs to be done?'
		},
		on: {
			enter: (e, stamp) => {
				e.state.set({ 
					todos: {
						[Date.now()]: { text: e.target.value }
					}
				}, stamp)
				e.target.value = ''
			}
		}
	}
}

const footer = {
	counter: {
		class: 'todo-count',
		tag: 'span',
		// text: { 
		// 	$: 'todos.items',
		// 	$transform: val => {
		// 		var cnt = 0
		// 		val.each(p => {
		// 			if(p.get('done', false).compute()) {
		// 				cnt++
		// 			}
		// 		})
		// 		return `todos completed ${cnt}`
		// 	}
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
		all: { href: { text: 'all' } },
		active: { href: { text: 'active' } },
		completed: { href: { text: 'completed' } }
	}
}

const todoapp = {
	header,
	main: {
		tag: 'section',
		toggle: {
			tag: 'input',
			props: { type: 'checkbox' },
			class: 'toggle-all',
			on: {
				click: (e, stamp) => {
					e.state.get('todos', {}).each((p) => {
						p.set({ done: true }, stamp)
					})
				}
			}
		},
		list: {
			tag: 'ul',
			class: 'todo-list',
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
