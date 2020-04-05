import React, { useState } from "react"
import PropTypes from "prop-types"
import Decks from './Decks'
import CardEditor from './CardEditor'
import { cardUpdate, sortedInsert } from "./utils";

const ConfigEditor = ({ id, card :initCard, decks :initDecks }) => {

  const [card, setCard] = useState(initCard);
  const [decks, setDecks] = useState(initDecks);
  const [edits, setEdits] = useState(false);

  const setCurrentCard = (card) => {
    // if(edits) {
    //   alert('Unable to Change card as pending edits exist')
    // } else {
    //   initialCard = card;
      setCard(card);
    // }
  };
  const updateCard = (event) => {
    setCard({ ...card, [event.currentTarget.id]: event.currentTarget.value });
    setEdits(true);
  };

  const saveCard = async (event) => {
    event.stopPropagation();
    let response = await cardUpdate(
      { card: card },
      id
    )
    // ).then(response => {
      console.log('oioioioio')
      setEdits(false)
      let savedCard = response.card;
      setCard({ ...savedCard })
      let newd = { ...decks, [savedCard.deck]: sortedInsert(savedCard, decks[savedCard.deck], (card) => card.name ) }

      setDecks(newd)
    // }).catch(response => {
    //   console.log(response);
    // })
  };

  return <div className="row">
    <div className="six columns">
      <Decks {...decks} setCard={setCurrentCard} />
    </div>
    <div className="six columns">
      <CardEditor {...card} updateCard={updateCard} saveCard={saveCard} />
      <div>
        <h2>Rules....</h2>
      </div>
    </div>
  </div>
}

export default ConfigEditor
