import React from "react"
import PropTypes from "prop-types"
class CardEditor extends React.Component {
  render () {
    return (
      <form action={"/game_configs/" + this.props.game_id} method="POST">
        <h2>Card Editor</h2>
        <input name="_method" type="hidden" value="patch" />
        <input name="authenticity_token" type="hidden" value={window.csrfToken} />

        <div className="editorField">
          <label htmlFor="id">ID</label>
          <input id="id" name="card[id]" readOnly={true} type="text" defaultValue={this.props.id} />
        </div>

        <div className="editorField">
          <label htmlFor="name">Name</label>
          <input id="name" name="card[name]" type="text" defaultValue={this.props.name} />
        </div>

        <div className="editorField">
          <label htmlFor="cost">Cost</label>
          <input id="cost" name="card[cost]" type="text" defaultValue={this.props.cost} required={true} />
        </div>

        <div className="editorField">
          <label htmlFor="rounds">Rounds</label>
          <input id="rounds" name="card[rounds]" type="number" defaultValue={this.props.rounds} required={true} />
        </div>

        <div className="editorField">
          <label htmlFor="actions">Actions</label>
          <textarea id="actions" name="card[actions]" defaultValue={this.props.actions} />
        </div>

        <div className="editorField">
          <label htmlFor="deck">Deck</label>
          <input id="deck" name="card[deck]" type="text" defaultValue={this.props.deck} required={true} />
        </div>

        <div className="editorField">
          <label htmlFor="number">Number</label>
          <input id="number" name="card[number]" type="number" defaultValue={this.props.number} onChange={this.handleInputChange} required={true} />
        </div>

        <div className="editorField">
          <input type="submit" value="Save" />
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
  rounds: PropTypes.string
};

export default CardEditor
