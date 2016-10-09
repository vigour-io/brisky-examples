const s = require('vigour-state/s')
const render = require('brisky/render')

const element = {
  $: 'object',
  hello: {
    text: {
      $: 'hello'
    }
  },
  world: {
    text: {
      $: 'world'
    }
  }
}

const state = s({
  object: {
    hello: 'Hello',
    world: 'World!'
  }
})

document.appendchild(render(element, state))
