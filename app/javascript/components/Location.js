import React from "react"
import PropTypes from "prop-types"
import CardStack from "./CardStack";
class Location extends React.Component {

  render () {
    return (
      <div className="location">
        <div className="location__title">{this.props.name}</div>
        <div className="row">
          <CardStack key={this.props.discard.id} cards={this.props.discard.cards} size="small" name="Discard" />
          <CardStack key={this.props.pile.id} cards={this.props.pile.cards} size="small" name="Backlog" />
          <CardStack key={this.props.fu_cards.id} cards={this.props.fu_cards.cards} size="small" name="Face up" />
        </div>
      </div>
    );
  }
}

Location.propTypes = {
  name: PropTypes.string,
  deck: PropTypes.string
};
export default Location
