import React, { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import Location from "./Location";
import Player from "./Player";
import CardActions from "./CardActions";
import Dices from "./Dices";
import { setCards, pollEvents } from '../state/CardState';

const GameBoard = (props) =>  {
  window.gameBoardId = props.id;

  const [displayCard, setDisplayCard] = useState(false);
  const [card, setCard] = useState();
  const [params, setParams] = useState(props.params);

  useEffect(() => {
    let interval = setInterval(pollEvents, 5000);
    return () => { clearInterval(interval) }
  })

  setCards(props.cards);

  // TODO: stop these being window functions and final a better way to pass state
  window.setCard = (newCard) => {
    setCard(newCard);
    setDisplayCard(true)
  };

  window.update_board = (locations, players, next_action) => {
    setLocations(locations);
    setPlayers(players);
    window.actionId = nextAction;
  };

  function removeCard(event) {
    if(event.target === event.currentTarget)
      this.setState({card: null, displayCard: false})
  }

  return (
    <div>
      <div className="game__title">{props.name}</div>
      <div className="row">
          <Dices />
      </div>
      <div className="row">
        <div className="four columns">
          {props.locations.filter(l => l.type == 'deck').map((location) => (
            <Location key={location.id} {...location} stacks={props.stacks['deck']} params={params[location.id]} />
          ))}
        </div>
        <div className="eight columns">
          {props.locations.filter(l => l.type === 'player').map((player) => (
            <Player key={player.id} {...player} stacks={props.stacks['player']} tokens={params[player.id]} />
          ))}
        </div>
      </div>
      <div className="fixed__top-right" style={{display: card ? 'block' : 'none'}} onClick={removeCard}>
        <CardActions card={card} />
      </div>
    </div>
  );
}

GameBoard.propTypes = {
  id: PropTypes.string,
  key: PropTypes.string,
  name: PropTypes.string,
  gameId: PropTypes.string,
  cards: PropTypes.array,
  locations: PropTypes.array,
  stacks: PropTypes.object,
  params: PropTypes.object,
};
export default GameBoard
