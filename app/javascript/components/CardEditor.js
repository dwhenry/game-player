import React from "react"
import PropTypes from "prop-types"

const CardEditor = (props) => {
  return (
    <form>
      <h2>Card Editor</h2>

      <div className="editorField">
        <label htmlFor="id">ID</label>
        <input id="id" name="card[id]" readOnly={true} type="text" value={props.id} onChange={props.updateCard} />
      </div>

      <div className="editorField">
        <label htmlFor="name">Name</label>
        <input id="name" name="card[name]" type="text" value={props.name} onChange={props.updateCard} />
      </div>

      <div className="editorField">
        <label htmlFor="cost">Cost</label>
        <input id="cost" name="card[cost]" type="text" value={props.cost} onChange={props.updateCard} required={true} />
      </div>

      <div className="editorField">
        <label htmlFor="rounds">Rounds</label>
        <input id="rounds" name="card[rounds]" type="number" value={props.rounds} onChange={props.updateCard} required={true} />
      </div>

      <div className="editorField">
        <label htmlFor="actions">Actions</label>
        <textarea id="actions" name="card[actions]" value={props.actions} onChange={props.updateCard} />
      </div>

      <div className="editorField">
        <label htmlFor="deck">Deck</label>
        <input id="deck" name="card[deck]" type="text" value={props.deck} onChange={props.updateCard} required={true} />
      </div>

      <div className="editorField">
        <label htmlFor="number">Number</label>
        <input id="number" name="card[number]" type="number" value={props.number} onChange={props.updateCard} required={true} />
      </div>

      <div className="editorField">
        <a className="button button-primary" onClick={props.saveCard}>Save</a>
        <a className="button button-secondary" onClick={props.cancelEdit}>Cancel</a>
      </div>
    </form>
  );
}

CardEditor.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  cost: PropTypes.string,
  actions: PropTypes.string,
  deck: PropTypes.string,
  number: PropTypes.string,
  rounds: PropTypes.string,
  updateCard: PropTypes.func,
  saveCard: PropTypes.func,
  cancelEdit: PropTypes.func
};

CardEditor.defaultProps = {
  id : '',
  name : '',
  cost : '',
  actions : '',
  deck : '',
  number : '',
  rounds : ''
};

export default CardEditor
