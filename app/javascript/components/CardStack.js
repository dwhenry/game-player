import React, { useState } from "react"
import PropTypes from "prop-types"
import {CardFace, CardBack, CardSpot} from './Card'
import DropTarget from "./DropTarget";
import { postEvent } from "../modules/utils"
import { hasEvent, addEvent } from "../modules/ownership"
import {updateCard} from '../state/CardState';
import {useGlobal} from 'reactn'

const CardStack = (props) => {
  // const [allCards, cardsActions] = CardState();
  let [cards, setCards] = useGlobal(props.locationId + '-' + props.stack);
  let [globals, setGlobals] = useGlobal();
  // const [cards, setCards] = useState()
  // const [cardIds, setCardIds] = useState({ids: 'pending'})
  const itemDropped = (eventId) => {
    let [objectId, fromLocationId, fromStack] = eventId.split("/");

    let event = {
      objectId: objectId,
      from: { locationId: fromLocationId, stack: fromStack },
      to: { locationId: props.locationId, stack: props.stack },
      timestamp: new Date().getTime()
    }
    if(addEvent(objectId, event)) {
      postEvent(objectId, event);
      // move the card in the stack
      updateCard(globals, event)
    }
  };

  const renderSpots = (cards) => {
    let result = [];
    cards = cards || []
    for (let i = 0; i < (props.min_cards - cards.length); i++) {
      result.push(<CardSpot key={props.locationId + ':' + props.stack + ':' + i} size={props.size} />)
    }
    return result
  }

  if(cards && cards.find(card => card.visible === 'face') === undefined) {
    let card = cards[cards.length-1];
    // all cards are face down so group them an d just show a number
    return <DropTarget onItemDropped={itemDropped} className={"stack stack-" + props.stack} >
      <div className="stack__name" data-testid={props.locationId + '-' + props.stack}>{props.name}</div>
      <CardBack key={card.id} card={card} size={props.size} count={cards.length} eventId={card.objectId + "/" + props.locationId + "/" + props.stack} />                  
    </DropTarget>

  } else {
    return <DropTarget onItemDropped={itemDropped} className={"stack stack-" + props.stack} >
      <div className="stack__name" data-testid={props.locationId + '-' + props.stack}>{props.name}</div>
      {cards && cards.map((card) => {
        switch(card.visible) {
          case 'face':
            return <CardFace key={card.id} card={card} size={props.size} eventId={card.objectId + "/" + props.locationId + "/" + props.stack} />
          case 'back':
            // TODO: work out how to render this cards on top of each other..        
            return <CardBack key={card.id} card={card} size={props.size} eventId={card.objectId + "/" + props.locationId + "/" + props.stack} />
        }    
      })}
      {renderSpots(cards)}
    </DropTarget>
  }
};

CardStack.propTypes = {
  locationId: PropTypes.string,
  name: PropTypes.string,
  cards: PropTypes.array,
  size: PropTypes.string,
  stack: PropTypes.string,
  min_cards: PropTypes.number,
};

CardStack.defaultProps = {
  min_cards: 1,
  count: 1
};

export default CardStack
