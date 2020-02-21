import React from "react"
import PropTypes from "prop-types"
class Card extends React.Component {
  renderOverlay() {
    if(this.props.overlay !== undefined) {
      return <div className="card__overlay">{this.props.overlay}</div>
    }
  }

  renderAction(action, i) {
    if(action !== null) {
      return <li key={i}><span><b>{i}:</b> {action}</span></li>
    }
  }
  render () {
    if(this.props.visible) {
      return (
        <div className="card">
          <div className={"card__element card__" + this.props.deck + "-deck card--size-" + this.props.size}>
            <div className="card__title">{this.props.title}</div>
            <div className="card__cost">{this.props.cost}G</div>
            <ul className="card__actions">
              {this.props.actions.map((action, i) => (
                this.renderAction(action, i + 1)
              ))}
            </ul>
          </div>
          {this.renderOverlay()}
        </div>
      );
    } else {
      return (
        <div className="card">
          <div className={"card__element card__" + this.props.deck + "-deck card--face-down"}></div>
        </div>
      )
    }
  }
}

Card.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  cost: PropTypes.number,
  actions: PropTypes.array,
  deck: PropTypes.string,
  visible: PropTypes.bool,
  overlay: PropTypes.string,
  size: PropTypes.string
};
export default Card
