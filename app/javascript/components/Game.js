import React from "react"
import PropTypes from "prop-types"
import Location from "./Location";
import Player from "./Player";
class Game extends React.Component {
  render () {
    return (
      <div>
        <div className="row">
          <div className="game__title">{this.props.name}</div>
        </div>
        <div className="row">
          <div className="col-6">
            {this.props.locations.map((location) => (
              <Location key={location.id} {...location} />
            ))}
          </div>
          {/*<div className="col-6">*/}
            {/*{this.props.players.map((player) => (*/}
              {/*<Player key={player.id} {...player} />*/}
            {/*))}*/}
          {/*</div>*/}
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  key: PropTypes.string,
  name: PropTypes.string,
  game_id: PropTypes.string,
  locations: PropTypes.array,
  players: PropTypes.array,
  log: PropTypes.array
};
export default Game
