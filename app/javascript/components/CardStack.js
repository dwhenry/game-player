import React from "react"
import PropTypes from "prop-types"
import Card from './Card'
import DropTarget from "./DropTarget";
import { ajaxUpdate } from "./utils"

class CardStack extends React.Component {
  constructor(props) {
    super(props);

    this.itemDropped = this.itemDropped.bind(this);
  }
  itemDropped(card_id) {
    const data = JSON.stringify({task: 'cardMove', action_id: window.action_id, card: {id: card_id, location: this.props.location, stack: this.props.stack}})
    ajaxUpdate(data, 'Error moving card...');
  }
  render () {
    return <DropTarget className="stack" onItemDropped={this.itemDropped}>
      <div className="stack__name">{this.props.name}</div>
      {this.props.cards.map((card) => {
        return <Card key={card.id} card={card} size={this.props.size} />
      })}
    </DropTarget>
  }
}

CardStack.propTypes = {
  name: PropTypes.string,
  cards: PropTypes.array,
  size: PropTypes.string,
  location: PropTypes.string,
  stack: PropTypes.string,
};
export default CardStack
