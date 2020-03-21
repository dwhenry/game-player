import React from "react"
import PropTypes from "prop-types"
class CardEditor extends React.Component {
  render () {
    return (
      <form>
        <h2>Card Editor</h2>

        <div className="editorField">
          <label htmlFor="id">ID</label>
          <input id="id" name="card[id]" readOnly={true} type="text" value={this.props.id} onChange={this.props.updateCard} />
        </div>

        <div className="editorField">
          <label htmlFor="name">Name</label>
          <input id="name" name="card[name]" type="text" value={this.props.name} onChange={this.props.updateCard} />
        </div>

        <div className="editorField">
          <label htmlFor="cost">Cost</label>
          <input id="cost" name="card[cost]" type="text" value={this.props.cost} onChange={this.props.updateCard} required={true} />
        </div>

        <div className="editorField">
          <label htmlFor="rounds">Rounds</label>
          <input id="rounds" name="card[rounds]" type="number" value={this.props.rounds} onChange={this.props.updateCard} required={true} />
        </div>

        <div className="editorField">
          <label htmlFor="actions">Actions</label>
          <textarea id="actions" name="card[actions]" value={this.props.actions} onChange={this.props.updateCard} />
        </div>

        <div className="editorField">
          <label htmlFor="deck">Deck</label>
          <input id="deck" name="card[deck]" type="text" value={this.props.deck} onChange={this.props.updateCard} required={true} />
        </div>

        <div className="editorField">
          <label htmlFor="number">Number</label>
          <input id="number" name="card[number]" type="number" value={this.props.number} onChange={this.props.updateCard} required={true} />
        </div>

        <div className="editorField">
          <a className="button button-primary" onClick={this.props.saveCard}>Save</a>
        </div>
      </form>
    );
  }
}

CardEditor.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  cost: PropTypes.string,
  actions: PropTypes.array,
  deck: PropTypes.string,
  number: PropTypes.string,
  rounds: PropTypes.string,
  updateCard: PropTypes.func,
  saveCard: PropTypes.func
};

export default CardEditor
