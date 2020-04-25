import React, { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import Location from "./Location";
import Player from "./Player";
import CardActions from "./CardActions";
import Dices from "./Dices";
import { setCards } from '../state/CardState';
import { useGlobal } from 'reactn'
import { pollEvents } from '../modules/ownership'

const GameBoard = (props) =>  {
  window.gameBoardId = props.id;

  const [displayCard, setDisplayCard] = useState(false);
  const [card, setCard] = useState();
  const [playerTokens, setPlayerTokens] = useState(props.player_tokens); 
  const [locationParams, setlocationParams] = useState(props.location_params); 
  
  setCards(props.cards);

  const [globals, setGlobals] = useGlobal();
  let globalsRef = useRef(globals);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(globalsRef.current)
      pollEvents(globalsRef);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
          {props.locations.map((location) => (
            <Location key={location.id} {...location} stacks={props.location_stacks} params={locationParams[location.id]} />
          ))}
        </div>
        <div className="eight columns">
          {props.players.map((player) => (
            <Player key={player.id} {...player} stacks={props.player_stacks} tokens={playerTokens[player.id]} />
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
  location_stacks: PropTypes.array,
  location_params: PropTypes.object,
  players: PropTypes.array,
  player_stacks: PropTypes.array,
  player_tokens: PropTypes.object,
};
export default GameBoard
