import React from "react"
import PropTypes from "prop-types"
import Card from './Card'
class CardStack extends React.Component {
  render () {
    return <div className="stack">
      <div className="stack__name">{this.props.name}</div>
      {this.props.cards.map((card) => {
        if(card['visible'] === 'face') {
          return <Card key={card.id} card={card} visible={true} size={this.props.size} title="help" />
        } else if(card['visible'] === 'back') {
          return <Card key={card.id} card={card} visible={false} size={this.props.size} title="help" />
        } else { // placeholder location
          return <Card key={card.id} card={card} size={this.props.size} title="help" />
        }
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
