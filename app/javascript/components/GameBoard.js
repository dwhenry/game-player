import React, { useState } from "react"
import PropTypes from "prop-types"
import Location from "./Location";
import Player from "./Player";
import CardActions from "./CardActions";
import Dices from "./Dices";
import { pollEvents } from '../state/CardState';

const GameBoard = (props) =>  {
  const [displayCard, setDisplayCard] = useState(false);
  const [card, setCard] = useState();
  const [params, setParams] = useState(props.params);

  // TODO: stop these being window functions and final a better way to pass state
  window.setCard = (newCard) => {
    setCard(newCard);
    setDisplayCard(true)
  };

  function removeCard(event) {
    if(event.target === event.currentTarget)
      this.setState({card: null, displayCard: false})
  }

  return (
    <React.Fragment>
      <div className="game__title">{props.name}</div>
      <a href="#" onClick={pollEvents}>Manually Poll</a>
      <div className="row grey-middle">
        {props.locations.filter(l => l.type == 'deck').map((location) => (
          <Location key={location.id} {...location} stacks={props.stacks['deck']} params={params[location.id]} />
        ))}
      </div>
      <div className="row grey-middle">
        {props.locations.filter(l => l.type === 'player').map((player) => (
          <Player key={player.id} {...player} stacks={props.stacks['player']} tokens={params[player.id]} />
        ))}
      </div>
      <div className="fixed__top-right" style={{display: card ? 'block' : 'none'}} onClick={removeCard}>
        <CardActions card={card} />
      </div>
      <div className="row grey-middle">
        <Dices />
      </div>
    </React.Fragment>
  );
}

GameBoard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  locations: PropTypes.array,
  stacks: PropTypes.object,
  params: PropTypes.object
};
export default GameBoard
