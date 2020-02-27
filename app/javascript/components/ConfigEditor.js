
import React from "react"
import PropTypes from "prop-types"
import Decks from './Decks'
import CardEditor from './CardEditor'
import JsonEditor from "./JsonEditor";

class ConfigEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = { card: props.card, decks: props.decks, canEdit: false };
  }

  setCard = (card) => {
    this.setState({card: card})
  };

  editJson = (ev) => {
    ev.stopPropagation();
    this.setState({canEdit: true});
  };

  renderEditor() {
    if(this.state.canEdit) {
      return <JsonEditor decks={this.state.decks} />
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

