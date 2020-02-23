import React from "react"
import PropTypes from "prop-types"
class CardEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id || '',
      name: props.name || '',
      cost: props.cost || '',
      actions: props.actions || '',
      deck: props.deck || '',
      number: props.number || ''
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.id === prevState.id) {
      return prevState;
    } else {
      return {
        id: nextProps.id || '',
        name: nextProps.name || '',
        cost: nextProps.cost || '',
        actions: nextProps.actions || '',
        deck: nextProps.deck || '',
        number: nextProps.number || ''
      };
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.id;

    this.setState({
      [name]: value
    });
  }

  render () {
    return (
      <form action={"/game_configs/" + this.props.game_id} method="POST">
        <h2>Card Editor</h2>
        <input name="_method" type="hidden" value="patch" />
        <input name="authenticity_token" type="hidden" value={window.csrfToken} onChange={this.handleInputChange} />
        <div className="editorField">
          <label htmlFor="id">ID</label>
          <input id="id" name="card[id]" readOnly={true} type="text" value={this.state.id} onChange={this.handleInputChange} />
        </div>

        <div className="editorField">
          <label htmlFor="name">Name</label>
          <input id="name" name="card[name]" type="text" value={this.state.name} onChange={this.handleInputChange} />
        </div>

        <div className="editorField">
          <label htmlFor="cost">Cost</label>
          <input id="cost" name="card[cost]" type="number" value={this.state.cost} onChange={this.handleInputChange} required={true} />
        </div>

        <div className="editorField">
          <label htmlFor="actions">Actions</label>
          <textarea id="actions" name="card[actions]" value={this.state.actions} onChange={this.handleInputChange} />
        </div>

        <div className="editorField">
          <label htmlFor="deck">Deck</label>
          <input id="deck" name="card[deck]" type="text" value={this.state.deck} onChange={this.handleInputChange} required={true} />
        </div>

        <div className="editorField">
          <label htmlFor="number">Number</label>
          <input id="number" name="card[number]" type="number" value={this.state.number} onChange={this.handleInputChange} required={true} />
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
