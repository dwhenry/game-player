import React from "react"
import PropTypes from "prop-types"
import Token from "./Token";
import Card from "./Card";
import CardStack from "./CardStack";
import { ajaxUpdate } from "./utils"

const Player = (props) => {
  function incrementRound(ev) {
    ev.stopPropagation();
    const data = JSON.stringify({task: 'incRound', action_id: window.action_id, player: {id: props.id}})
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
        <CardStack cards={props.backlog} location={props.id} stack="backlog" size="small" name="Backlog" />
        <CardStack cards={props.board} location={props.id} stack="board" size="small" name="Board" />
        <CardStack cards={props.fu_cards} location={props.id} stack="fu" size="small" name="Face Up" />
        <CardStack cards={props.employees} location={props.id} stack="employees" size="small" name="Staff" />
        <CardStack cards={props.hand} location={props.id} stack="hand" size="small" name="Hand" />
      </div>
    </div>
  );
}

Player.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  hand: PropTypes.array,
  fu_cards: PropTypes.array,
  tokens: PropTypes.object
};
export default Player
