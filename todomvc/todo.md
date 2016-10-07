

###Todo:

- Add filtering options.
- Fix global done checkbox.
- Footer: Subscribe to amount of items in state, show total + ' items left'.

- Filters:

// Add filtering options.
// When active is clicked, done items needs hidden class.
// When completed is clicked, invert.
// For all, remove hidden class completely.

console.log('Event: %O || Stamp: %O', e, stamp)



Note: 
- In benchmark, I have to define object to allow update.

          const test = e.state.get('todos', {}).keys().length
          console.log('test: %O', test)