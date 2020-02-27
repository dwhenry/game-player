import React from "react"
import PropTypes from "prop-types"
import { JsonEditor as Editor } from 'jsoneditor-react';
import Ajv from 'ajv';
class JsonEditor extends React.Component {
  render() {
    const ajv = new Ajv({ allErrors: true, verbose: true })

    return (
      <div class="modal">
        <Editor
            value={this.props.decks}
            onChange={this.handleChange}
            history={true}
            ajv={ajv}
            schema={schemaDef}
        />
      </div>
    );
  }
}


JsonEditor.propTypes = {
  id: PropTypes.string,
  decks: PropTypes.object
};

export default JsonEditor



