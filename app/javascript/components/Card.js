// use strict
import React from "react"
import PropTypes from "prop-types"
import Drag from "./Drag";

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    window.setCard(this.props.card)
  }

  renderOverlay() {
    if(this.props.overlay !== undefined) {
      return <div className="card__overlay">{this.props.overlay}</div>
    }
  }

  renderActions(actions) {
    if(!actions) return null

    return actions.split("\n").map((action, i) => (
      this.renderAction(action, i + 1)
    ))
  }

  renderAction(action, i) {
    if(action !== null) {
      return <li key={i}><span>{action}</span></li>
    }
  }

  render () {
    if(this.props.card.visible === 'face') {
      return (
        <Drag className="card" onClick={this.handleClick}  dataItem={this.props.card.id}>
          <div style={{display: 'none'}} className="card__type">Visible: {this.props.card.name}</div>
          <div className={"card__element card__" + this.props.card.deck + "-deck card--size-" + this.props.size}>
            <div className="card__title">{this.props.card.name}</div>
            <div className="card__cost">{this.props.card.cost}</div>
            <div className={"card__round card__round__" + this.props.card.round + " card__rounds__" + this.props.card.rounds} >
              <span className="round__1">&nbsp;</span>
              <span className="round__2">&nbsp;</span>
              <span className="round__3">&nbsp;</span>
            </div>
            <ul className="card__actions">
              {this.renderActions(this.props.card.actions)}
            </ul>
          </div>
          {this.renderOverlay()}
        </Drag>
      );
    } else if(this.props.card.visible === 'back') {
      return (
        <Drag className="card" onClick={this.handleClick} dataItem={this.props.card.id}>
          <div style={{display: 'none'}} className="card__type">Hidden: {this.props.count}</div>
          <div className={"card__element card__" + this.props.card.deck + "-deck card--face-down card--size-" + this.props.size}>
            <div className="card__cost">{this.props.count}</div>
          </div>
        </Drag>
      )
    } else {
      return (
        <div className="card" onClick={this.handleClick}>
          <div style={{display: 'none'}} className="card__type">None</div>
          <div className={"card__element card__" + this.props.card.deck + "-deck card--face-down card--size-" + this.props.size} />
        </div>
      )
    }
  }
}

Card.propTypes = {
  card: PropTypes.object,
  count: PropTypes.number
};

export default Card
