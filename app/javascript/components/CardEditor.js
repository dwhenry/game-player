import React from "react"
import PropTypes from "prop-types"
class CardEditor extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     id: undefined,
  //     title: undefined,
  //     cost: undefined,
  //     actions: undefined,
  //     deck: undefined,
  //     number: undefined
  //   }
  // }
  //
  // ComponentDidMount() {
  //   const { id, title, cost, actions, deck, number  } = this.props;
  //   this.setState({ id, title, cost, actions, deck, number });
  // }

  render () {
    const { id, name, cost, actions, deck, number  } = this.props;

    return (
      <form action={"/game_configs/" + this.props.game_id} method="POST">
        <input name="_method" type="hidden" value="patch" />
        <input name="authenticity_token" type="hidden" value={window.csrfToken} onChange={()=>{}} />
        <div className="editorField">
          <label htmlFor="card_id">ID</label>
          <input id="card_id" name="card[id]" type="text" value={id} onChange={()=>{}} />
        </div>

        <div className="editorField">
          <label htmlFor="card_name">Name</label>
          <input id="card_name" name="card[name]" type="text" value={name} onChange={()=>{}} />
        </div>

        <div className="editorField">
          <label htmlFor="card_cost">Cost</label>
          <input id="card_cost" name="card[cost]" type="text" value={cost} onChange={()=>{}} required={true} />
        </div>

        <div className="editorField">
          <label htmlFor="card_actions">Actions</label>
          <textarea id="card_actions" name="card[actions]" value={actions} onChange={()=>{}} />
        </div>

        <div className="editorField">
          <label htmlFor="card_deck">Deck</label>
          <input id="card_deck" name="card[deck]" type="text" value={deck} onChange={()=>{}} required={true} />
        </div>

        <div className="editorField">
          <label htmlFor="card_number">Number</label>
          <input id="card_number" name="card[number]" type="text" value={number} onChange={()=>{}} required={true} />
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
  number: PropTypes.string
};

export default CardEditor
