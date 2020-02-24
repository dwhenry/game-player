
import React from "react"
import PropTypes from "prop-types"
import Decks from './Decks'
import CardEditor from './CardEditor'

window.csrfToken = document.querySelector('[name=csrf-token]').content

class ConfigEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = { card: props.card };
  }


  setCard = (card) => {
    this.setState({card: card})
  };

  render () {
    return <div className="row">
      <div className="six columns">
        <Decks {...this.props.decks} setCard={this.setCard} />
      </div>
      <div className="six columns">
        <CardEditor {...this.state.card} game_id={this.props.id} />
        <div>
          <h2>Rules....</h2>
        </div>
      </div>
    </div>
  }
}

ConfigEditor.propTypes = {
  id: PropTypes.string,
  decks: PropTypes.object
};

export default ConfigEditor

