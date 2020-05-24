import React, { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import GameBoard from "./GameBoard";
import { setSetters } from '../state/CardState'

const GameBoardSetter = (props) => {
  const [locations, setLocations] = useState(props.locations);

  useEffect(() => {
    setSetters({setLocations: setLocations})
  });

  try {
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
  } catch (e){
    console.log(e)
  }
}

GameBoardSetter.propTypes = {
  id: PropTypes.string,
  key: PropTypes.string,
  name: PropTypes.string,
  gameId: PropTypes.string,
  cards: PropTypes.array,
  locations: PropTypes.array,
  stacks: PropTypes.object,
  params: PropTypes.object,
  skipPolling: PropTypes.bool,
};
export default GameBoardSetter
