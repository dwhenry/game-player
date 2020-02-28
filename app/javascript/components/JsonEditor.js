import React from "react"
import PropTypes from "prop-types"
import { JsonEditor as Editor } from 'jsoneditor-react';
import Ajv from 'ajv';
import { deckDefintion } from './schemaDef'
class JsonEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { json: null, errors: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
    this.setJson = this.setJson.bind(this);
  }
  handleChange(json) {
    this.setState(({json: json}))
  }
  handleErrors(errors) {
    this.setState({errors: errors.length > 0})
  }
  setJson(ev) {
    ev.stopPropagation();
    if(this.state.errors) {
      alert("Can't update the json at this stage as errors exist")
    } else {
      this.props.updateJSON(this.state.json);
    }
  }
  render() {
    const ajv = new Ajv({ allErrors: true, verbose: true })

    return (
      <div className="modal">
        <a href="#" className="button" onClick={this.setJson}>Save</a>
        <a href="#" className="button" onClick={this.props.cancelEdit}>Cancel</a>
        <Editor
            value={this.props.decks}
            onChangeJSON={this.handleChange}
            onValidationError={this.handleErrors}
            history={true}
            ajv={ajv}
            schema={deckDefintion}
        />
      </div>
    );
  }
}


JsonEditor.propTypes = {
  id: PropTypes.string,
  decks: PropTypes.object,
  updateJSON: PropTypes.func,
  cancelEdit: PropTypes.func,
};

export default JsonEditor



