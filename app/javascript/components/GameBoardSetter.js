import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import GameBoard from "./GameBoard";
import { setSetters } from '../state/CardState'
import { setCards, pollEvents } from '../state/CardState';

const GameBoardSetter = (props) => {
  const [locations, setLocations] = useState(props.locations);

  setCards(props.cards);

  if(!props.skipPolling) {
    useEffect(() => {
      let interval = setInterval(pollEvents, 5000);
      return () => {
        clearInterval(interval)
      }
    })
  }

  useEffect(() => {
    setSetters({setLocations: (l) => {
      debugger;
      console.log(l);
      setLocations({...locations, ...l})
    }});
    return () => { setSetters({setLocations: () => {}}) }
  });

  return <GameBoard
    id={props.id}
    key={props.key}
    name={props.name}
    gameId={props.gameId}
    cards={props.cards}
    locations={locations}
    stacks={props.stacks}
    params={props.params}
    skipPolling={props.skipPolling}
  />
}

GameBoardSetter.propTypes = {
  id: PropTypes.string,
  key: PropTypes.string,
  name: PropTypes.string,
  gameId: PropTypes.string,
  cards: PropTypes.array,
  locations: PropTypes.array,
  stacks: PropTypes.object,
  params: PropTypes.object
};
export default GameBoardSetter
