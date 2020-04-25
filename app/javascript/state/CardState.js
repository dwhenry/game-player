import React from "react";
import useStore from "./globalHook";

const initialState = {};

const actions = {
  moveCard: (store, card) => {
    // let cards = store.state;
    // let cardPos = cards.findIndex(card => card.objectId === objectId)
    // cards[cardPos] = card
    // store.setState(cards)
  },

  setCards: (store, cards) => {
    store.setState({cards: cards})
  }
}

const CardState = useStore(React, initialState, actions);

export default CardState
