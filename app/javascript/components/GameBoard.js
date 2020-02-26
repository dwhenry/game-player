import React from "react"
import PropTypes from "prop-types"
import Location from "./Location";
import Player from "./Player";
import CardActions from "./CardActions";
class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { displayCard: false, card: null };
    window.setCard = this.setCard.bind(this);
    this.removeCard = this.removeCard.bind(this);
  }
  setCard(card) {
    this.setState({card: card, displayCard: true})
  }
  removeCard(event) {
    if(event.target === event.currentTarget)
      this.setState({card: null, displayCard: false})
  }
  render () {
    return (
      <div>
        <div className="row">
          <div className="game__title">{this.props.name}</div>
        </div>
        <div className="row">
          <div className="four columns">
            {this.props.locations.map((location) => (
              <Location key={location.id} {...location} location={location.id} />
            ))}
          </div>
          <div className="eight columns">
            {this.props.players.map((player) => (
              <Player key={player.id} {...player} />
            ))}
          </div>
        </div>
        <div className="fixed__top-right" style={{display: this.state.displayCard ? 'block' : 'none'}} onClick={this.removeCard}>
          <CardActions card={this.state.card} game_id={this.props.id} />
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
