import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import GameBoard from "./GameBoard";
import { setSetters } from '../state/CardState'
import { setCards, pollEvents } from '../state/CardState';

const GameBoardSetter = (props) => {
  window.gameBoardId = props.id;

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
    name={props.name}
    locations={locations}
    stacks={props.stacks}
    params={props.params}
  />
}

GameBoardSetter.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  cards: PropTypes.array,
  locations: PropTypes.array,
  stacks: PropTypes.object,
  params: PropTypes.object
  skipPolling: PropTypes.bool
};
export default GameBoardSetter
