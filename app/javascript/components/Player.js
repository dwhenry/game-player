import React from "react"
import PropTypes from "prop-types"
import Token from "./Token";
import Card from "./Card";
import CardStack from "./CardStack";
import { ajaxUpdate } from "./utils"

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.incrementRound = this.incrementRound.bind(this);
  }
  incrementRound(ev) {
    ev.stopPropagation();
    const data = JSON.stringify({task: 'incRound', action_id: window.action_id, player: {id: this.props.id}})
    ajaxUpdate(data, 'Error incrementing round...');
  }
  render () {
    return (
      <div className="player">
        <div className="player__title">Player: {this.props.name}</div>
        <div className="player__inc-round"><a href="#" onClick={this.incrementRound}>Increment Round</a></div>
        <div className="row">
          <div className="tokens">
            <Token key="cash" playerId={this.props.id} name="cash" quantity={this.props.tokens.cash || 0}/>
            <Token key="energy" playerId={this.props.id} name="energy" quantity={this.props.tokens.energy || 0}/>
            <Token key="achievement" playerId={this.props.id} name="sp" quantity={this.props.tokens.sp || 0}/>
          </div>
          <CardStack cards={this.props.backlog} location={this.props.id} stack="backlog" size="small" name="Backlog" />
          <CardStack cards={this.props.hand} location={this.props.id} stack="hand" size="small" name="Hand" />
          <CardStack cards={this.props.board} location={this.props.id} stack="board" size="small" name="Board" />
          <CardStack cards={this.props.fu_cards} location={this.props.id} stack="fu" size="small" name="Face Up" />
          <CardStack cards={this.props.employees} location={this.props.id} stack="employees" size="small" name="Staff" />
        </div>
      </div>
    );
  }
}

Player.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  hand: PropTypes.array,
  fu_cards: PropTypes.array,
  tokens: PropTypes.object
};
export default Player
