import React, { useState } from "react"
import PropTypes from "prop-types"
import Location from "./Location";
import Player from "./Player";
import CardActions from "./CardActions";
import Dices from "./Dices";

const GameBoard = (props) =>  {

  const [displayCard, setDisplayCard] = useState(false);
  const [card, setCard] = useState();
  const [players, setPlayers] = useState(props.players);
  const [locations, setLocations] = useState(props.locations);
  const [nextAction, setNextAction] = useState(props.next_action);

  // TODO: stop these being window functions and final a better way to pass state
  window.setCard = (newCard) => {
    setCard(newCard);
    setDisplayCard(true)
  };

  window.update_board = (locations, players, next_action) => {
    setLocations(locations);
    setPlayers(players);
    window.action_id = nextAction;
  };

  function removeCard(event) {
    if(event.target === event.currentTarget)
      this.setState({card: null, displayCard: false})
  }

  return (
    <div data-testid={nextAction}>
      <div className="game__title">{props.name}</div>
      <div className="row">
          <Dices />
      </div>
      <div className="row">
        <div className="four columns">
          {locations.map((location) => (
            <Location key={location.id} {...location} location={location.id} />
          ))}
        </div>
        <div className="eight columns">
          {players.map((player) => (
            <Player key={player.id} {...player} />
          ))}
        </div>
      </div>
      <div className="fixed__top-right" style={{display: card ? 'block' : 'none'}} onClick={removeCard}>
        <CardActions card={card} game_id={props.id} />
      </div>
    </div>
  );
}

GameBoard.propTypes = {
  key: PropTypes.string,
  name: PropTypes.string,
  game_id: PropTypes.string,
  locations: PropTypes.array,
  players: PropTypes.array,
  log: PropTypes.array,
  next_action: PropTypes.string
};
export default GameBoard
