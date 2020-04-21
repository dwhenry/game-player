import React from "react"
import PropTypes from "prop-types"
import Card from './Card'
import DropTarget from "./DropTarget";
import { ajaxUpdate } from "./utils"

const CardStack = (props) => {
  const locationId = props.id + '-' + props.stack;
  const itemDropped = (cardId, fromLocationId) => {
    const data = {
      task: 'cardMove',
      action_id: window.actionId,
      card: {
        id: cardId,
        locationId: locationId,
        fromLocationId: fromLocationId,
        stack: props.stack
      }
    }
    ajaxUpdate(data, 'Error moving card...');
  };
  let id = 0;
  const cards = () => {
    let cards = props.cards.filter((card) => card.location_id === (props.locationId + '-' + props.stack));
    while(cards.length < props.min_cards) {
      cards.push({id: 'slot-' + id++, visible: 'slot'});
    } 
    return cards;
  }

  return <DropTarget onItemDropped={itemDropped} className={"stack stack-" + props.stack} >
    <div className="stack__name" data-testid={props.locationId + '-' + props.stack}>{props.name}</div>
    {cards().map((card) => <Card key={card.id} card={card} size={props.size} count={props.count} stackId={props.locationId + '-' + props.stack} />)}
  </DropTarget>
};

CardStack.propTypes = {
  locationId: PropTypes.string,
  name: PropTypes.string,
  cards: PropTypes.array,
  size: PropTypes.string,
  stack: PropTypes.string,
  count: PropTypes.number,
  min_cards: PropTypes.number,
};

CardStack.defaultProps = {
  min_cards: 1,
  count: 1
};

export default CardStack
