import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import GameBoard from "./GameBoard";
import { setSetters } from '../state/CardState'
import { setCards, pollEvents, setLastEventId } from '../state/CardState';

const GameBoardSetter = (props) => {
  window.gameBoardId = props.id;

  const [locations, setLocations] = useState(props.locations);

  if(!props.skipPolling) {
    useEffect(() => {
      let interval = setInterval(pollEvents, 5000);
      return () => {
        clearInterval(interval)
      }
    })
  }


  // useEffect(() => {
  //   setLastEventId(props.lastEventId);
  //   setSetters({
  //     setLocations: (l) => {
  //       setLocations(locations.map((location) => {
  //         if(location.id === l.player_id) {
  //           return {...location, [location.name]: l.player_name }
  //         } else { return location }
  //       }));
  //       return locations.filter(l => l.type === 'player').map(l => l.id).indexOf(l.player_id) + 1;
  //     },
  //     location: locations
  //   });
  //   return () => {
  //     setSetters({setLocations: () => {}, locations: [], lastEventId: () => {}, setlastEventId: () => {}})
  //   }
  // });

  return <Provider store={store}>
    <GameBoard
      name={props.name}
      locations={locations}
      stacks={props.stacks}
      params={props.params}
    />
    <StateSetup cards={props.cards} />
    <Counter />
  </Provider>
};

GameBoardSetter.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  cards: PropTypes.array,
  locations: PropTypes.array,
  stacks: PropTypes.object,
  params: PropTypes.object,
  skipPolling: PropTypes.bool,
  lastEventId: PropTypes.number
};
export default GameBoardSetter
