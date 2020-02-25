import React from "react"
import PropTypes from "prop-types"
import Location from "./Location";
import Player from "./Player";
class GameBoard extends React.Component {
  render () {
    return (
      <div>
        <div className="row">
          <div className="game__title">{this.props.name}</div>
        </div>
        <div className="row">
          <div className="four columns">
            {this.props.locations.map((location) => (
              <Location key={location.id} {...location} />
            ))}
          </div>
          <div className="eight columns">
            {this.props.players.map((player) => (
              <Player key={player.id} {...player} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

GameBoard.propTypes = {
  key: PropTypes.string,
  name: PropTypes.string,
  game_id: PropTypes.string,
  locations: PropTypes.array,
  players: PropTypes.array,
  log: PropTypes.array
};
export default GameBoard
