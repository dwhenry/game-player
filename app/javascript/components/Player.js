import React from "react"
import PropTypes from "prop-types"
import Token from "./Token";
import Card from "./Card";
import CardStack from "./CardStack";
class Player extends React.Component {
  render () {
    if(this.props.status == 'pending') {
      return(
        <div className="player">
          <div className="player__title">Player: Pending</div>
          <div className="row">
            <CardStack cards={this.props.backlog}  size="small" name="Backlog" />
            <CardStack cards={this.props.hand} size="small" name="Hand" />
            <CardStack cards={this.props.board}  size="small" name="Board" />
            <CardStack cards={this.props.fu_cards}  size="small" name="Face Up" />
          </div>
        </div>
      )
    } else {
      return (
        <div className="player">
          <div className="player__title">Player: {this.props.name}</div>
          <div className="row">
            <div className="tokens">
              <div className="token__header">Tokens</div>
              <Token key="cash" name="cash" quantity={this.props.tokens.cash || 0}/>
              <Token key="energy" name="energy" quantity={this.props.tokens.energy || 0}/>
              <Token key="achievement" name="achievement" quantity={this.props.tokens.achievement || 0}/>
            </div>
            {this.props.fu_cards.map((card) => (
              <Card key={card.id} {...card} />
            ))}
            <div className="hand">
              {this.props.hand.map((card) => (
                <Card key={card.id} {...card} size="small"/>
              ))}
            </div>
          </div>

        </div>
      );
    }
  }
}

Player.propTypes = {
  name: PropTypes.string,
  hand: PropTypes.array,
  fu_cards: PropTypes.array,
  tokens: PropTypes.object
};
export default Player
