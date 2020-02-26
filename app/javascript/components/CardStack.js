import React from "react"
import PropTypes from "prop-types"
import Card from './Card'
import DropTarget from "./DropTarget";
import Rails from "@rails/ujs"
// import ReactOnRails from 'react-on-rails';

class CardStack extends React.Component {
  constructor(props) {
    super(props);

    this.itemDropped = this.itemDropped.bind(this);
  }
  itemDropped(card_id) {
    const data = JSON.stringify({card: {id: card_id, location: this.props.location, stack: this.props.stack, action_id: window.action_id}})
    Rails.ajax({
      url: '/games/' + window.game_id, // + '.json',
      type: 'put',
      beforeSend(xhr, options) {
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        options.data = data;
        return true
      },
      success: function(response, t, x) {
        if (response.locations) {
          window.update_board(response.locations, response.players, response.next_action);
        }
      },
      error: function(response) {
        if(response.error) {
          alert('Error moving card...' + response.error);
          window.action_id = response.next_action;
        }
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
