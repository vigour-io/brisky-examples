

###Todo:

- Cleanup Subscribe to amount of items in state, show total + ' items left'.
-- Add default value to counter / trigger render first time.
-- Ensure that deleted items are accounted for.

- Add filtering options. Filters:
-- Add filtering options.
-- When active is clicked, done items needs hidden class.
-- When completed is clicked, invert.
-- For all, remove hidden class completely.


Note: 
- In benchmark, I have to define object to allow update.
- I'm having the weirdest side-effect when testing for done in Clear completed.

state.lookUp('current') ?