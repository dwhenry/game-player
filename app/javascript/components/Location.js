import React from "react"
import PropTypes from "prop-types"
import Card from "./Card";
import CardStack from "./CardStack";
class Location extends React.Component {

  render () {
    return (
      <div className="location">
        <div className="location__title">{this.props.name}</div>
        <div className="row">
          <CardStack key={this.props.items[1].id} {...(this.props.items[1])} deck={this.props.deck} />
          <CardStack key={this.props.items[0].id} {...(this.props.items[0])} deck={this.props.deck} />
          <Card key={this.props.items[2].id} {...this.props.items[2]} />
          <Card key={this.props.items[3].id} {...this.props.items[3]} />
        </div>
      </div>
    );
  }
}

Location.propTypes = {
  name: PropTypes.string,
  deck: PropTypes.string
};
export default Location
