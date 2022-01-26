import React from "react"
import PropTypes from "prop-types"
import store from '../state/store'
import { useSelector } from 'react-redux'

const cardsForDeck = deck => state => {
  return state.config.cards[deck];
}

const CardItem = (props) => {
  function cloneCard(event) {
    event.preventDefault();
    store.dispatch({
      type: 'config/SET_CARD',
      payload: { selected: {...props.card, id: ""} }
    })
  }

  function editCard(event) {
    event.preventDefault();
    store.dispatch({
      type: 'config/SET_CARD',
      payload: { selected: {...props.card} }
    })
  }

  return <li className="deck__card">
    <a href="#" onClick={editCard}>({props.card.number}) {props.card.name}</a> - <a href="#" onClick={cloneCard}>Clone</a>
  </li>
};

const Decks = (props) => {
  function addCard(event) {
    event.preventDefault();
    const deckName = event.currentTarget.getAttribute('data-deck');
    store.dispatch({
      type: 'config/SET_CARD',
      payload: { selected: {deck: deckName} }
    })
  }

  function renderDeck(name) {
    const cards = useSelector(cardsForDeck(name))
    return <div className={"deck-" + name}>
      <div className="deck__title">({cards.length}) {name} </div>
      <a className="deck__add-link" href="#" data-deck={name} onClick={addCard}>Add Card</a>
      <ul>
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </ul>
    </div>
  }

  return (
    <div className="decks">
      { renderDeck('tasks') }
      <br />
      { renderDeck('achievements') }
      <br />
      { renderDeck('employees') }
    </div>
  );
};

export default Decks
