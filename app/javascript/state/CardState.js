import React from "react";
import useGlobalHook from "./globalHook";

const initialState = {};

const actions = {
  updateCard: (store, card, event) => {
    let fromLocationId = event.from.locationId + '-' + event.from.stack;
    let toLocationId = event.to.locationId + '-' + event.to.stack;
    let fromLocation = store.state[fromLocationId];
    let toLocation = store.state[toLocationId] || [];

    // remove it from the old location
    fromLocation = fromLocation.filter(l => l === card.objectId)

    // add it to the new location
    toLocation.push(card.objectId)

    store.setState({[card.objectId]: card, [fromLocationId]: fromLocation, [toLocationId]: toLocation})

    console.log("updated")
  },

  setCards: (store, cards) => {
    let state = { order: {} }
    cards.forEach((c) => {
      if(state[c.locationId] == undefined) state[c.locationId] = [];
      state[c.locationId].push(c.objectId);
      state[c.objectId] = c;;
    })
    store.setState(state)
  }
}

const CardState = useGlobalHook(React, initialState, actions);

export default CardState
