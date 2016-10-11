

###Todo:

- Make better fix for global done checkbox.

- Cleanup Subscribe to amount of items in state, show total + ' items left'.
-- Add default value to counter.
-- Ensure that deleted items are accounted for.

- Add filtering options. Filters:
-- Add filtering options.
-- When active is clicked, done items needs hidden class.
-- When completed is clicked, invert.
-- For all, remove hidden class completely.


Note: 
- In benchmark, I have to define object to allow update.


- When subscribing to events, would it be possible to do something like this?

    on: {
      (blur && enter): (e, stamp) => {
        e.state.set({ text: e.target.value }, stamp)
      }
    }