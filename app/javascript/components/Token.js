import React from "react"
import PropTypes from "prop-types"
class Token extends React.Component {
  render () {
    return (
     <div className={"token token__" + this.props.name}>
        {this.props.name}: {this.props.quantity}
     </div>
    );
  }
}

Token.propTypes = {
  name: PropTypes.string,
  quantity: PropTypes.number
};
export default Token
