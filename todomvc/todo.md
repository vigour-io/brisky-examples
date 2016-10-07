

###Todo:

- Make better fix for global done checkbox.

- Cleanup Subscribe to amount of items in state, show total + ' items left'.
-- Add default value to counter.

- Add filtering options. Filters:
-- Add filtering options.
-- When active is clicked, done items needs hidden class.
-- When completed is clicked, invert.
-- For all, remove hidden class completely.


Note: 
- In benchmark, I have to define object to allow update.


// Code-bank:

const test = e.state.get('todos', {}).keys().length
console.log('test: %O', test)

const selectedFilter = e.state.root.get('selectedFilter')


console.log('Event: %O || Stamp: %O', e, stamp)