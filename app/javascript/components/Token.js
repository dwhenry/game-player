import React from "react"
import PropTypes from "prop-types"
import { ajaxUpdate } from "./utils"

class Token extends React.Component {
  constructor(props) {
    super(props);

    this.incTokens = this.incTokens.bind(this)
    this.decTokens = this.decTokens.bind(this)
  }
  incTokens(ev) {
    ev.stopPropagation()
    const data = JSON.stringify({task: 'changeTokens', action_id: window.action_id, token: {player_id: this.props.playerId, tokenType: this.props.name, changed: 1}})
    ajaxUpdate(data, 'Error updating tokens...');
  }
  decTokens(ev) {
    ev.stopPropagation()
    const data = JSON.stringify({task: 'changeTokens', action_id: window.action_id, token: {player_id: this.props.playerId, tokenType: this.props.name, changed: -1}})
    ajaxUpdate(data, 'Error updating tokens...');
  }
  render () {
    return (
     <div className={"token token__" + this.props.name}>
       <span className={"token__image token__image-" + this.props.name}>{this.props.quantity}</span>
       <a href="#" className={"token__count token__count__inc"} onClick={this.incTokens} >+</a>
       <a href="#" className={"token__count token__count__dec"} onClick={this.decTokens} >-</a>
     </div>
    );
  }
}

Token.propTypes = {
  playerId: PropTypes.string,
  name: PropTypes.string,
  quantity: PropTypes.number
};
export default Token
