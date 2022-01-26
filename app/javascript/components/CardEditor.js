import React from "react"
import { useSelector, useDispatch, configUpdateCard } from 'react-redux'
import { configSaveCard, configCancelEdit } from "../state/Stack"
let currentCard = state => state.config.currentCard

const CardEditor = (props) => {
  let card = useSelector(currentCard)
  const dispatch = useDispatch()

  // // TODO: do I even need this anymore???
  function updateCard() {
    dispatch(configUpdateCard(card))
  }
  function save() {
    dispatch(saveCard(card))
    //store.dispatch(saveCard) // TODO: add thunk to do this
  }
  function cancel() {
    dispatch(configCancelEdit)
  }
  return (
    <form>
      <h2>Card Editor</h2>

      <div className="editorField">
        <label htmlFor="id">ID</label>
        <input id="id" name="card[id]" readOnly={true} type="text" value={card.id} />
      </div>

      <div className="editorField">
        <label htmlFor="name">Name</label>
        <input id="name" name="card[name]" type="text" value={card.name} onChange={updateCard} />
      </div>

      <div className="editorField">
        <label htmlFor="cost">Cost</label>
        <input id="cost" name="card[cost]" type="text" value={card.cost} onChange={updateCard} required={true} />
      </div>

      <div className="editorField">
        <label htmlFor="rounds">Rounds</label>
        <input id="rounds" name="card[rounds]" type="number" value={card.rounds} onChange={updateCard} required={true} />
      </div>

      <div className="editorField">
        <label htmlFor="actions">Actions</label>
        <textarea id="actions" name="card[actions]" value={card.actions} onChange={updateCard} />
      </div>

      <div className="editorField">
        <label htmlFor="deck">Deck</label>
        <input id="deck" name="card[deck]" type="text" value={card.deck} required={true} />
      </div>

      <div className="editorField">
        <label htmlFor="number">Number</label>
        <input id="number" name="card[number]" type="number" value={card.number} onChange={updateCard} required={true} />
      </div>

      <div className="editorField">
        <a className="button button-primary" onClick={save}>Save</a>
        <a className="button button-secondary" onClick={cancel}>Cancel</a>
      </div>
    </form>
  );
}

export default CardEditor
