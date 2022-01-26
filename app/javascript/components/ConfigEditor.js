import React, { useState } from "react"
import Decks from './Decks'
import CardEditor from './CardEditor'
import { cardUpdate, sortedInsert } from "../modules/utils";
import store from '../state/store'
import { Provider } from 'react-redux'

const ConfigEditor = ({ id, card :selectedCard, cards :initialCards }) => {
  window.gameID = id;

  store.dispatch({
    type: "config/ADD_CARDS",
    payload: {
      cards: initialCards,
      selected: selectedCard
    }
  })

  return <Provider store={store}>
    <div className="row">
    <div className="six columns" data-testid="all-decks">
      <Decks />
    </div>
    <div className="six columns">
      <CardEditor />
      <div>
        <h2>Rules....</h2>
      </div>
    </div>
  </div>
  </Provider>
}

export default ConfigEditor
