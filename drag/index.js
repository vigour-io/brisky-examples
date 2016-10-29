'use strict'
require('./style.css')
const render = require('brisky/render')
const s = require('vigour-state/s')
const state = global.state = s({
  drag: {
    top: 0,
    left: 0
  },
  boxDimensions: {}
})

const dragApp = {
  class: 'application',
  on: {
    drag: (e, stamp) => {
      state.root.set({
        drag: {
          left: e.x,
          top: e.y
        }
      })
    }
  },
  box: {
    $: 'drag',
    class: 'draggable',
    style: {
      left: {
        $: 'left',
        $transform: val => {
          const boxDimensions = state.root.boxDimensions
          const width = boxDimensions.width && boxDimensions.width.compute()
          let offset = val - (width / 2)
          if (offset <= 0) return 0
          return offset
        }
      },
      top: {
        $: 'top',
        $transform: val => {
          const height = state.root.boxDimensions.height && state.root.boxDimensions.height.compute()
          let offset = val - (height / 2)
          if (offset <= 0) return 0
          return offset
        }
      }
    },
    content: {
      text: 'I`m a draggable'
    },
    on: {
      drag: (e, stamp) => {
        const boundingRect = e.target.getBoundingClientRect()
        state.root.set({
          boxDimensions: {
            width: boundingRect.width,
            height: boundingRect.height,
            left: boundingRect.left,
            top: boundingRect.top,
            right: boundingRect.right,
            bottom: boundingRect.bottom
          }
        })
      }
    }
  },
  target: {
    class: 'target',
    inner: {
      class: 'inner',
      text: 'I`m a target'
    }
  }
}

const app = {
  child: { class: true, child: 'Constructor' },
  dragApp
}

document.body.appendChild(render(app, state))
