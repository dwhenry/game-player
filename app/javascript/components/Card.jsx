import React from "react"
import PropTypes from "prop-types"
class Card extends React.Component {
  render () {
    return (
      <React.Fragment>
        Id: {this.props.id}
        Title: {this.props.title}
        Cost: {this.props.cost}
        Actions: {this.props.actions}
        Deck: {this.props.deck}
      </React.Fragment>
    );
  }
}

Card.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  cost: PropTypes.number,
  actions: PropTypes.string,
  deck: PropTypes.array
};
export default Card
