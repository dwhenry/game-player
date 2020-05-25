import React from "react"
import PropTypes from "prop-types"
import Token from "./Token";
import CardStack from "./CardStack";
import { ajaxUpdate } from "../modules/utils"

const Player = (props) => {
  function incrementRound(ev) {
    ev.stopPropagation();
    const data = JSON.stringify({task: 'incRound', action_id: window.actionId, player: {id: props.id}})
    ajaxUpdate(data, 'Error incrementing round...');
  }

  return (
    <div className={"col-md-6 grey-center player player-" + props.id}>
      <div className="row">
        <div className="col-md-12 center-md player__title">{props.name}</div>
        <div className="player__inc-round"><a href="#" onClick={incrementRound}>Increment Round</a></div>
        <div className="col-sm-10 center-md">
          {props.stacks.map(([name, stack]) => <CardStack key={props.id + '-' + stack} stack={stack} locationId={props.id} name={name} size="small" />) }
        </div>
        <div className="col-sm-2 center-sm tokens">
          <Token key="cash" playerId={props.id} name="cash" quantity={props.tokens.cash || 0}/>
          <Token key="energy" playerId={props.id} name="energy" quantity={props.tokens.energy || 0}/>
          <Token key="achievement" playerId={props.id} name="sp" quantity={props.tokens.sp || 0}/>
        </div>
      </div>
    </div>
  );
}

Player.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  stacks: PropTypes.array,
  tokens: PropTypes.object
};
export default Player
