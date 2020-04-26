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
    <div className={"location location-" + props.deck}>
      <div className="location__title">{props.name}</div>
      <div className="row">
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
  );
};

Location.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  deck: PropTypes.string,
  stacks: PropTypes.array,
  params: PropTypes.object,
};

export default Location
