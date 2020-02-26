import React from "react"
import PropTypes from "prop-types"
import Card from './Card'
class CardActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }
  renderCard() {
    if(this.props.card.visible === 'face') {
      return <Card key={this.props.card.id} card={this.props.card} visible={true} />
    } else if(this.props.card.visible === 'back') {
      return <Card key={this.props.card.id} card={this.props.card} visible={false} />
    } else { // placeholder location
      return <Card key={this.props.card.id} card={this.props.card} />
    }
  }
  render () {
    if(!!this.props.card) {
      return(
        <div className="card-actions">
          {this.renderCard()}
        </div>
      )
    }
    return null;
  }
}

CardActions.propTypes = {
  card: PropTypes.object,
  game_id: PropTypes.string,
};
export default CardActions
