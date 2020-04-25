import React from 'react';
import { setGlobal, useGlobal } from 'reactn';

export const updateCard = (globals, event) => {
  let fromLocationId = event.from.locationId + '-' + event.from.stack;
  let toLocationId = event.to.locationId + '-' + event.to.stack;

  // let [global, setGlobal] = useGlobal()

  let fromLocation = globals[fromLocationId];
  let toLocation = globals[toLocationId] || [];

  console.log(event)
  console.log(globals)
 // remove it from the old location
  let card = fromLocation.find(l => l.objectId === event.objectId)
  fromLocation = fromLocation.filter(l => !(l.objectId === event.objectId && l.pos === card.pos))

  // toLocation = toLocation.filter(l => !(l.objectId === event.objectId && l.pos === card.pos))
  // add it to the new location
  toLocation.push(event.card || {...card, pending: pending})

  setGlobal({[fromLocationId]: fromLocation, [toLocationId]: toLocation})
}

export const setCards = (cards) => {
  let state = {};
  cards.forEach((c) => {
    if(state[c.locationId] == undefined) state[c.locationId] = [];
    if(c.count) {
      for(let i=0; i < c.count; i++) {
        state[c.locationId].push({...c, pos: i});
      }
    } else {
      state[c.locationId].push(c);
    }
    // state[c.objectId] = c;;
  })
  setGlobal(state);
}

export const applyEvents = (globals, events) => {
  events.forEach((event) => {
    updateCard(globals, event)
  })
}