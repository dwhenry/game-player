
import React from "react"
import PropTypes from "prop-types"
import Decks from './Decks'
import CardEditor from './CardEditor'

class ConfigEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = { card: props.card };
  }

  setCard = (card) => {
    this.setState({card: card})
  };

  editJson = () => {

  };

  render () {
    return <div className="row">
      <div className="six columns">
        <Decks {...this.props.decks} setCard={this.setCard} />
      </div>
      <div className="six columns">
        <CardEditor {...this.state.card} game_id={this.props.id} editJson={this.editJson} />
        <div>
          <h2>Rules....</h2>
        </div>
      </div>
      <JsonEditor
    </div>
  }
}

ConfigEditor.propTypes = {
  id: PropTypes.string,
  decks: PropTypes.object
};

export default ConfigEditor

