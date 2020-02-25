import React from "react"
import PropTypes from "prop-types"
import Card from './Card'
class CardStack extends React.Component {
  render () {
    return <React.Fragment>
      {this.props.cards.map((card) => {
        if(card['visible'] === 'face') {
          return <Card key={card.id} {...card} visible={true} size={this.props.size} title="help" />
        } else if(card['visible'] === 'back') {
          return <Card key={card.id} {...card} visible={false} size={this.props.size} title="help" />
        } else {
          return <Card key={card.id} size={this.props.size} title="help" />
        }
      })}
    </React.Fragment>
  }
}

CardStack.propTypes = {
  type: PropTypes.string,
  count: PropTypes.number,
  cards: PropTypes.array,
  deck: PropTypes.string
};
export default CardStack
