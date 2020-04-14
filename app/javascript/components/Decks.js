import React from "react"
import PropTypes from "prop-types"

const CardItem = (props) => {
  function cloneCard(event) {
    event.preventDefault();
    props.setCard({
      id: "",
      name: props.card.name,
      cost: props.card.cost,
      actions: props.card.actions,
      deck: props.card.deck,
      number: props.card.number,
      rounds: props.card.rounds,
    })
  }

  function editCard(event) {
    event.preventDefault();
    props.setCard(props.card)
  }

  return <li className="deck__card">
    <a href="#" onClick={editCard}>({props.card.number}) {props.card.name}</a> - <a href="#" onClick={cloneCard}>Clone</a>
  </li>
};

const Decks = (props) => {
  function addCard(event) {
    event.preventDefault();
    const deckName = event.currentTarget.getAttribute('data-deck');
    props.setCard({deck: deckName})
  }

  function renderDeck(cards, name) {
    const filteredCards = cards.filter(c => c.deck === name);
    return <div className={"deck-" + name}>
      <div className="deck__title">({filteredCards.length}) {name} </div>
      <a className="deck__add-link" href="#" data-deck={name} onClick={addCard}>Add Card</a>
      <ul>
        {filteredCards.map((card) => (
          <CardItem key={card.id} card={card} setCard={props.setCard} />
        ))}
      </ul>
    </div>
  }

  return (
    <div className="decks">
      { renderDeck(props.cards, 'tasks') }
      <br />
      { renderDeck(props.cards, 'achievements') }
      <br />
      { renderDeck(props.cards, 'employees') }
    </div>
  );
};

Decks.propTypes = {
  tasks: PropTypes.array,
  employees: PropTypes.array,
  achievements: PropTypes.array,
  rules: PropTypes.object
};
export default Decks
