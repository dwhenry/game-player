import React from "react"
import PropTypes from "prop-types"
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

    return actions.map((action, i) => (
      this.renderAction(action, i + 1)
    ))
  }

  renderAction(action, i) {
    if(action !== null) {
      return <li key={i}><span><b>{i}:</b> {action}</span></li>
    }
  }

  render () {
    if(this.props.card.visible === 'face') {
      return (
        <div className="card" onClick={this.handleClick}>
          <div className={"card__element card__" + this.props.card.deck + "-deck card--size-" + this.props.size}>
            <div className="card__title">{this.props.card.name}</div>
            <div className="card__cost">{this.props.card.cost}G</div>
            <ul className="card__actions">
              {this.renderActions(this.props.card.actions)}
            </ul>
          </div>
          {this.renderOverlay()}
        </div>
      );
    } else {
      return (
        <div className="card" onClick={this.handleClick}>
          <div className={"card__element card__" + this.props.card.deck + "-deck card--face-down card--size-" + this.props.size}></div>
        </div>
      )
    }
  }
}

Card.propTypes = {
  card: PropTypes.object
}
//   id: PropTypes.string,
//   title: PropTypes.string,
//   cost: PropTypes.number,
//   actions: PropTypes.array,
//   deck: PropTypes.string,
//   visible: PropTypes.bool,
//   overlay: PropTypes.string,
//   size: PropTypes.string
// };
export default Card
