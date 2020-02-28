import React from "react"
import PropTypes from "prop-types"
import Decks from './Decks'
import CardEditor from './CardEditor'
import JsonEditor from "./JsonEditor";
import { ajaxConfig } from "./utils"

class ConfigEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { card: props.card, originalDeck: JSON.parse(JSON.stringify(props.decks)), decks: props.decks, canEdit: false };
    this.updateJSON = this.updateJSON.bind(this);
    window.setDecks = this.setDecks.bind(this);
  }

  setCard = (card) => {
    this.setState({card: card});
  };

  editJson = (ev) => {
    ev.stopPropagation();
    this.setState({canEdit: true});
  };

  updateJSON = (json) => {
    this.setState({canEdit: false});
    const data = JSON.stringify({decks: json});
    ajaxConfig(
      data,
      'Error moving card...',
        this.props.id
    );
  };
  setDecks(decks) {
    this.setState({decks: decks, originalDeck: JSON.parse(JSON.stringify(decks))});
  }
  cancelEdit = (ev) => {
    ev.stopPropagation();
    this.setState({canEdit: false});
    this.setState({decks: this.state.originalDeck});
  };

  renderEditor() {
    if(this.state.canEdit) {
      return <JsonEditor decks={this.state.decks} updateJSON={this.updateJSON} cancelEdit={this.cancelEdit} />
    }
  }

  render () {
    return <div className="row">
      <div className="six columns">
        <Decks {...this.state.decks} setCard={this.setCard} />
      </div>
      <div className="six columns">
        <CardEditor {...this.state.card} game_id={this.props.id} editJson={this.editJson} />
        <div>
          <h2>Rules....</h2>
        </div>
      </div>
      {this.renderEditor()}
    </div>
  }
}

ConfigEditor.propTypes = {
  id: PropTypes.string,
  decks: PropTypes.object
};

export default ConfigEditor

