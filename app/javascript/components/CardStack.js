import React from "react"
import PropTypes from "prop-types"
import Card from './Card'
import DropTarget from "./DropTarget";
import { ajaxUpdate } from "./utils"

const CardStack = (props) => {
  const itemDropped = (cardId) => {
    const data = {
      task: 'cardMove',
      action_id: window.actionId,
      card: {
        id: cardId,
        location: props.location,
        stack: props.stack
      }
    }
    ajaxUpdate(data, 'Error moving card...');
  };

  return <DropTarget onItemDropped={itemDropped} className={"stack stack-" + props.stack}>
    <div className="stack__name">{props.name}</div>
    {props.cards.map((card) => {
      return <Card key={card.id} id={card.id} card={card} size={props.size} count={props.count}/>
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
