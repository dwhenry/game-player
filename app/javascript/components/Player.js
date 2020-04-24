import React from "react"
import PropTypes from "prop-types"
import Token from "./Token";
import Card from "./Card";
import CardStack from "./CardStack";
import { ajaxUpdate } from "../modules/utils"

const Player = (props) => {
  function incrementRound(ev) {
    ev.stopPropagation();
    const data = JSON.stringify({task: 'incRound', action_id: window.actionId, player: {id: props.id}})
    ajaxUpdate(data, 'Error incrementing round...');
  }

  return (
    <div className={"player player-" + props.id}>
      <div className="player__title">Player: {props.name}</div>
      <div className="player__inc-round"><a href="#" onClick={incrementRound}>Increment Round</a></div>
      <div className="row">
        <div className="tokens">
          <Token key="cash" playerId={props.id} name="cash" quantity={props.tokens.cash || 0}/>
          <Token key="energy" playerId={props.id} name="energy" quantity={props.tokens.energy || 0}/>
          <Token key="achievement" playerId={props.id} name="sp" quantity={props.tokens.sp || 0}/>
        </div>
        {props.stacks.map(([name, stack]) => <CardStack key={props.id + '-' + stack} stack={stack} locationId={props.id} name={name} cards={props.cards} size="small" />) }
      </div>
    </div>
  );
}

Player.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  cards: PropTypes.array,
  stacks: PropTypes.array,
  tokens: PropTypes.object
};
export default Player
