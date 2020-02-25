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
          <form action={'/games/' + this.props.game_id} method="POST">
            <input name="_method" type="hidden" value="patch" />
            <input name="authenticity_token" type="hidden" value={window.csrfToken} />

            <input name="card[id]" type="hidden" value={this.props.card.id} />

            <div className="editorField">
              <label htmlFor="location">Location</label>
              <Select id="location" name="card[location]" type="text" defaultValue={this.props.id} options={this.state.locations}/>
            </div>

            <div className="editorField">
              <label htmlFor="stack">Stack</label>
              <input id="stack" name="card[stack]" type="text" defaultValue={this.props.id} />
            </div>

            <div className="editorField">
              <input type="submit" value="Move" />
            </div>
          </form>
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
