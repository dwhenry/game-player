// use strict
import React from "react"
import PropTypes from "prop-types"
import Drag from "./Drag";
import CardStack from "./CardStack";

export const CardFace = (props) => {
  const handleClick = () => {
    window.setCard(props.card)
  };

  function renderOverlay() {
    if(this.props.overlay !== undefined) {
      return <div className="card__overlay">{this.props.overlay}</div>
    }
  }

  function renderActions(actions) {
    return (actions || "").split("\n").map((action, i) => {
      if(action === "") return "";
      return <li key={i+1}><span>{action}</span></li>
    })
  }

  return (
    <Drag className={"card card-" + props.card.id} onClick={handleClick} dataItem={props.eventId} >
      <div style={{display: 'none'}} className="card__type">Visible: {props.card.name}</div>
      <div className={"card__element card__" + props.card.deck + "-deck card--size-" + props.size}>
        <div className="card__title">{props.card.name}</div>
        <div className="card__cost">{props.card.cost}</div>
        <div className={"card__round card__round__" + props.card.round + " card__rounds__" + props.card.rounds} >
          <span className="round__1">&nbsp;</span>
          <span className="round__2">&nbsp;</span>
          <span className="round__3">&nbsp;</span>
        </div>
        <ul className="card__actions">
          {renderActions(props.card.actions)}
        </ul>
      </div>
      {renderOverlay()}
    </Drag>
  );
}
export const CardBack = (props) => {
  const handleClick = () => {
    window.setCard(props.card)
  };

  return (
    <Drag className={"card card-" + props.card.id} onClick={handleClick} dataItem={props.eventId} >
      <div style={{display: 'none'}} className="card__type">Hidden: {props.count}</div>
      <div className={"card__element card__" + props.card.deck + "-deck card--face-down card--size-" + props.size}>
        <div className="card__cost">{props.count}</div>
      </div>
    </Drag>
  )
}

export const CardSpot = (props) => {
  const handleClick = () => {
    window.setCard(props.card)
  };

  return (
    <div className="card" onClick={handleClick}>
      <div style={{display: 'none'}} className="card__type">None</div>
      <div className={"card__element card--face-down card--size-" + props.size} />
    </div>
  )
};

CardFace.propTypes = CardBack.propTypes = {
  card: PropTypes.object,
  count: PropTypes.number,
  size: PropTypes.string,
  eventId: PropTypes.string,
};

CardSpot.prototype = {
  size: PropTypes.string,
};

const Card = {
  face: CardFace,
  back: CardBack,
  spot: CardSpot
}

export default Card
