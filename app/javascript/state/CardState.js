import React from 'react';
import { setGlobal, useGlobal } from 'reactn';

export const updateCard = (globals, event) => {
  let fromLocationId = event.from.locationId + '-' + event.from.stack;
  let toLocationId = event.to.locationId + '-' + event.to.stack;

  // let [global, setGlobal] = useGlobal()

  let fromLocation = globals[fromLocationId];
  let toLocation = globals[toLocationId] || [];

  // remove it from the old location
  let card = fromLocation.find(l => l.objectId === event.objectId)
  fromLocation = fromLocation.filter(l => l.objectId !== event.objectId)

  // add it to the new location
  toLocation.push(card)

  setGlobal({[fromLocationId]: fromLocation, [toLocationId]: toLocation})

  console.log("updated")
}

export const setCards = (cards) => {
  let state = { order: {} }
  cards.forEach((c) => {
    if(state[c.locationId] == undefined) state[c.locationId] = [];
    state[c.locationId].push(c);
    // state[c.objectId] = c;;
  })
  setGlobal(state);
}

