import React from "react"
import PropTypes from "prop-types"
import Card from './Card'
import DropTarget from "./DropTarget";
import Rails from "@rails/ujs"

class CardStack extends React.Component {
  constructor(props) {
    super(props);

    this.itemDropped = this.itemDropped.bind(this);
  }
  itemDropped(card_id) {
    const data = JSON.stringify({card: {id: card_id, location: this.props.location, stack: this.props.stack}})
    Rails.ajax({
      url: '/games/' + window.game_id,
      type: 'put',
      beforeSend(xhr, options) {
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        // Workaround: add options.data late to avoid Content-Type header to already being set in stone
        // https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts/rails-ujs/utils/ajax.coffee#L53
        options.data = data;
        return true
      },
      success: function() {
        debugger
        console.log('here')
      },
      error: function() {
        debugger
        console.log('here')
      },
    });
  }
  render () {
    return <DropTarget className="stack" onItemDropped={this.itemDropped}>
      <div className="stack__name">{this.props.name}</div>
      {this.props.cards.map((card) => {
        return <Card key={card.id} card={card} size={this.props.size} />
      })}
    </DropTarget>
  }
}

CardStack.propTypes = {
  name: PropTypes.string,
  cards: PropTypes.array,
  size: PropTypes.string,
  location: PropTypes.string,
  stack: PropTypes.string,
};
export default CardStack
