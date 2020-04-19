// use strict
import React from "react"
import PropTypes from "prop-types"
import Drag from "./Drag";

const Card = (props) => {
  const handleClick = () => {
    window.setCard(props.card)
  };

  function renderOverlay() {
    if(this.props.overlay !== undefined) {
      return <div className="card__overlay">{this.props.overlay}</div>
    }
  }

  function renderActions(actions) {
    if(!actions) return null

    return actions.split("\n").map((action, i) => (
      this.renderAction(action, i + 1)
    ))
  }

  function renderAction(action, i) {
    if(action !== null) {
      return <li key={i}><span>{action}</span></li>
    }
  }

  if(props.card.visible === 'face') {
    return (
      <Drag className={"card card-" + props.id} onClick={handleClick}  dataItem={props.card.id}>
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

  if(props.card.visible === 'back') {
    return (
      <Drag className={"card card-" + props.id} onClick={handleClick} dataItem={props.card.id}>
        <div style={{display: 'none'}} className="card__type">Hidden: {props.count}</div>
        <div className={"card__element card__" + props.card.deck + "-deck card--face-down card--size-" + props.size}>
          <div className="card__cost">{props.count}</div>
        </div>
      </Drag>
    )
  }

  return (
    <div className={"card card-" + props.id} onClick={handleClick}>
      <div style={{display: 'none'}} className="card__type">None</div>
      <div className={"card__element card__" + props.card.deck + "-deck card--face-down card--size-" + props.size} />
    </div>
  )
};

Card.propTypes = {
  card: PropTypes.object,
  count: PropTypes.number
};

export default Card
