import React, { useState } from "react"
import Decks from './Decks'
import CardEditor from './CardEditor'
import { cardUpdate, sortedInsert } from "./utils";

const ConfigEditor = ({ id, card :selectedCard, cards :initialCards }) => {

  const [card, setCard] = useState(selectedCard);
  const [cards, setCards] = useState(initialCards);
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
    );
    setEdits(false)
    let savedCard = response.card;
    setCard({ ...savedCard })

    setCards(sortedInsert(savedCard, cards, (card) => card.name ))
  };

  return <div className="row">
    <div className="six columns" data-testid="all-decks">
      <Decks cards={cards} setCard={setCurrentCard} />
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
