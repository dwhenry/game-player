import React from "react"
import PropTypes from "prop-types"
import Card from './Card'
class CardStack extends React.Component {
  render () {
    if (this.props.type === 'Discard') {
      let card = this.props.cards[0];
      console.log(card)
      return (
        <Card {...card} deck={this.props.deck} overlay={this.props.type}/>
      )
    } else {
      return (
        <div className="card">
          <div className={"card-stack__element card-stack__" + this.props.deck + "-deck"}></div>
        </div>
      )
    }
  }
}

CardStack.propTypes = {
  type: PropTypes.string,
  count: PropTypes.number,
  cards: PropTypes.array,
  deck: PropTypes.string
};
export default CardStack
