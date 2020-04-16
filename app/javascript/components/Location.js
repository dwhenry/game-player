import React from "react"
import PropTypes from "prop-types"
import CardStack from "./CardStack";
const Location = (props) => {

  return (
    <div className="location">
      <div className="location__title">{props.name}</div>
      <div className="row">
        <CardStack {...props.pile} location={props.location} size="small" name="Backlog" stack="pile" />
        <CardStack {...props.discard} location={props.location} size="small" name="Discard" stack="discard" />
        <CardStack {...props.fu_cards} location={props.location} size="small" name="Face up" stack="fu" />
      </div>
    </div>
  );
};

Location.propTypes = {
  name: PropTypes.string,
  deck: PropTypes.string,
  location: PropTypes.string,
};
export default Location
