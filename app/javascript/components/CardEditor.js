import React from "react"
import PropTypes from "prop-types"
class CardEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { card: {} }
  }

  render () {
    return (
      <div className="card">
      </div>
    );
  }
}

CardEditor.propTypes = {
  id: PropTypes.string
};
export default CardEditor
