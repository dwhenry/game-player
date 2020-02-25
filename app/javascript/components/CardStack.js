import React from "react"
import PropTypes from "prop-types"
import Card from './Card'
class CardStack extends React.Component {
  render () {
    return <div className="stack">
      <div className="stack__name">{this.props.name}</div>
      {this.props.cards.map((card) => {
        return <Card key={card.id} card={card} size={this.props.size} />
      })}
    </div>
  }
}

CardStack.propTypes = {
  name: PropTypes.string,
  cards: PropTypes.array,
  size: PropTypes.string
};
export default CardStack
