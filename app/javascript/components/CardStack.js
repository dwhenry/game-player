import React from "react"
import PropTypes from "prop-types"
import {CardFace, CardBack, CardSpot} from './Card'
import DropTarget from "./DropTarget";
import { postEvent } from "../modules/utils"
import { hasEvent, addEvent } from "../modules/ownership"

const CardStack = (props) => {
  const itemDropped = (eventId) => {
    let [objectId, fromLocationId, fromStack] = event.split("/");

    let data = {
      objectId: objectId,
      from: { locationId: fromLocationId, stack: fromStack },
      to: { locationId: props.locationId, stack: props.stack },
      timestamp: new Data().getTime()
    }
    if(addEvent(objectId, data)) {
      postEvent(objectId, data);
      // move the card in the stack
    }
  };

  let id = 0;
  let cards = props.cards.filter((card) => card.location_id === (props.locationId + '-' + props.stack));
  while(cards.length < props.min_cards) {
    cards.push({id: props.locationId + ':' + props.stack + ':' + id++, visible: 'slot'});
  } 

  return <DropTarget onItemDropped={itemDropped} className={"stack stack-" + props.stack} >
    <div className="stack__name" data-testid={props.locationId + '-' + props.stack}>{props.name}</div>
    {cards.map((card) => {
      switch(card.visible) {
        case 'face':
          return <CardFace key={card.id} card={card} size={props.size} count={props.count} eventId={(card.objectId || ('card:' + props.cardId + ':')) + "/" + props.locationId + '/' + props.stack} />
        case 'back':
          return <CardBack key={card.id} card={card} size={props.size} count={props.count} eventId={(card.objectId || ('location:' + props.locationId + ':' + props.stack)) + "/" + props.locationId + '/' + props.stack} />
        default:
          return <CardSpot key={card.id} size={props.size} />
      }0.
    })} 
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
