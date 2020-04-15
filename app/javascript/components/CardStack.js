import React from "react"
import PropTypes from "prop-types"
import Card from './Card'
import DropTarget from "./DropTarget";
import { ajaxUpdate } from "./utils"

const CardStack = (props) => {
  const itemDropped = (card_id) => {
    const data = JSON.stringify({task: 'cardMove', action_id: window.action_id, card: {id: card_id, location: this.props.location, stack: this.props.stack}})
    ajaxUpdate(data, 'Error moving card...');
  };

  return <DropTarget className="stack" onItemDropped={itemDropped}>
    <div className="stack__name">{props.name}</div>
    {props.cards.map((card) => {
      return <Card key={card.id} card={card} size={props.size} count={props.count} />
    })}
  </DropTarget>
};

CardStack.propTypes = {
  name: PropTypes.string,
  cards: PropTypes.array,
  size: PropTypes.string,
  location: PropTypes.string,
  stack: PropTypes.string,
  count: PropTypes.number
};

export default CardStack
