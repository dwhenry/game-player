import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {CardFace, CardBack, CardSpot} from './Card'
import DropTarget from "./DropTarget";
import { postEvent } from "../modules/utils"
import {addEvent, updateCard, watch, unWatch} from '../state/CardState';

const CardStack = (props) => {
  const itemDropped = ([objectLocator, fromLocationId, fromStack]) => {
    let event = {
      objectLocator: objectLocator,
      from: { locationId: fromLocationId, stack: fromStack },
      to: { locationId: props.locationId, stack: props.stack },
      timestamp: new Date().getTime()
    };
    if(addEvent(objectLocator, event)) {
      postEvent(objectLocator, event);
      // move the card in the stack
      updateCard({...event, pending: true})
    }
  };

  const renderSpots = (cards) => {
    let result = [];
    cards = cards || [];
    for (let i = 0; i < (props.min_cards - cards.length); i++) {
      result.push(<CardSpot key={props.locationId + ':' + props.stack + ':' + i} title={props.name} size={props.size} />)
    }
    return result
  };

  const [stackCards, setStackCards] = useState();

  useEffect(() => {
    let watchCallback = (cards) => { setStackCards(cards) }

    watch(props.locationId + '-' + props.stack, watchCallback)
    return () => { unWatch(props.locationId + '-' + props.stack, watchCallback) }
  });

  if(stackCards && stackCards.find(card => card.visible === 'face') === undefined) {
    let card = stackCards[stackCards.length-1];
    // all cards are face down so group them an d just show a number
    return <DropTarget onItemDropped={itemDropped} className={"stack stack-" + props.stack} >
      <div data-testid={props.locationId + '-' + props.stack}>
        <CardBack key={card.id} title={props.name} card={card} size={props.size} count={stackCards.length} dragEventId={[card.objectLocator, props.locationId, props.stack]} />
      </div>
    </DropTarget>

  } else {
    return <DropTarget onItemDropped={itemDropped} className={"stack stack-" + props.stack} >
      <div data-testid={props.locationId + '-' + props.stack}>
        {stackCards && stackCards.map((card) => {
          switch(card.visible) {
            case 'face':
              return <CardFace key={card.id} title={props.name} card={card} size={props.size} dragEventId={[card.objectLocator, props.locationId, props.stack]} />
            case 'back':
              // TODO: work out how to render this cards on top of each other..
              return <CardBack key={card.id} title={props.name} card={card} size={props.size} dragEventId={[card.objectLocator, props.locationId, props.stack]} />
          }
        })}
      </div>
      {renderSpots(stackCards)}
    </DropTarget>
  }
};

CardStack.propTypes = {
  locationId: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.string,
  stack: PropTypes.string,
  min_cards: PropTypes.number,
};

CardStack.defaultProps = {
  min_cards: 1,
  count: 1
};

export default CardStack
