import React from "react"
import PropTypes from "prop-types"
import CardStack from "./CardStack";
class Location extends React.Component {

  render () {
    return (
      <div className="location">
        <div className="location__title">{this.props.name}</div>
        <div className="row">
          <CardStack {...this.props.pile} location={this.props.location} size="small" name="Backlog" stack="pile" />
          <CardStack {...this.props.discard} location={this.props.location} size="small" name="Discard" stack="discard" />
          <CardStack {...this.props.fu_cards} location={this.props.location} size="small" name="Face up" stack="fu" />
        </div>
      </div>
    );
  }
}

Location.propTypes = {
  name: PropTypes.string,
  deck: PropTypes.string,
  location: PropTypes.string,
};
export default Location
