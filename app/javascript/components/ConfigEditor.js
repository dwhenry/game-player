import React, { useState } from "react"
import PropTypes from "prop-types"
import Decks from './Decks'
import CardEditor from './CardEditor'
import { cardUpdate } from "./utils";
// import JsonEditor from "./JsonEditor";

const ConfigEditor = ({ id, card :initCard, decks :initDecks }) => {
  const fixCard = (card) => {
    card.id || (card.id = '');
    card.name || (card.name = '');
    card.cost || (card.cost = '');
    card.actions || (card.actions = []);
    card.deck || (card.deck = '');
    card.number || (card.number = '');
    card.rounds || (card.rounds = '');

    return card;
  };

  const [card, setCard] = useState(fixCard(initCard));
  const [decks, setDecks] = useState(initDecks);
  const [edits, setEdits] = useState(false);

  const setCurrentCard = (card) => {
    // if(edits) {
    //   alert('Unable to Change card as pending edits exist')
    // } else {
    //   initialCard = card;
      setCard(fixCard(card));
    // }
  };
  const updateCard = (event) => {
    setCard({ ...card, [event.currentTarget.id]: event.currentTarget.value });
    setEdits(true);
  };
  const saveCard = (event) => {
    event.stopPropagation();
    cardUpdate(
      { card: card },
      id,
      (response) => {
        setEdits(false)
        debugger
        if(card.id === '') {
          card.id = response.card.id;
          this.state.desks[card.type].push(card)
        }

        // ensure it is in the right deck???
      }
    )

  };

  return <div className="row">
    <div className="six columns">
      <Decks {...decks} setCard={setCurrentCard} />
    </div>
    <div className="six columns">
      <CardEditor {card} updateCard={updateCard} saveCard={saveCard} />
      <div>
        <h2>Rules....</h2>
      </div>
    </div>
  </div>
}

export default ConfigEditor

