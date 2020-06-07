import React from "react"
import PropTypes from "prop-types"
import CardStack from "./CardStack";


const Location = (props) => {
  function sentenceCase (str) {
    return str.replace(/[a-z]/i, function (letter) {
      return letter.toUpperCase();
    }).trim();
  }

  return (
    <div className={"col-md-4 grey-center location location-" + props.id}>
      <div className="row">
        <div className="col-md-1 center-md location__title">
          <div className="text-rotate-right">
            {props.name}
          </div>
        </div>
        <div className="col-md-11 center-md">
          {props.stacks.map(([name, stack]) => {
            return <CardStack key={props.id + '-' + stack}
                              locationId={props.id}
                              name={name}
                              size="small"
                              stack={stack}
                              {...props.params[stack]} />
          })}
        </div>

      </div>
    </div>
  );
};

Location.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  stacks: PropTypes.array,
  params: PropTypes.object,
};

export default Location
