import React, { useState } from "react"
import styled from 'styled-components'

const StyledSlider = styled.div`
  position: relative;
  border-radius: 3px;
  background: #dddddd;
  height: 16px;
  min-width: 480px;
  max-width: 600px;
`;

const leftPosition = ({position, spots}) => { return 100 * position / (spots-1) };
const StyledThumb = styled.div`
  width: 20px;
  height: 26px;
  position: absolute;
  top: -5px;
  left: calc(${leftPosition}% - 10px);
  cursor: pointer;
  display: inline-block;
  
  &:before {
    position: absolute;
    content: "";
    left: 9px;
    width: 2px;
    height: 26px;
    border-radius: 1px;
    opacity: 0.5;
    background: #333;
    display: inline-block;
  }
  
  &.selected:after, &:hover:after {
    position: absolute;
    content: "";
    width: 16px;
    height: 16px;
    top: 5px;
    left: 2px;
    border-radius: 8px;
  }
  &:hover:after {
    background: red
  }
  &.selected:after {  
    background: #111;
  }  
`;

const Roll = styled.a`
  display: inline-block;
  vertical-align: text-bottom;
`

//  background: #823eb7;

const getPercentage = (current, max) => (100 * current) / max;
const getLeft = percentage => `calc(${percentage}% - 5px)`;

const Slider = ({spots, position, onChange}) => {
  const sliderRef = React.useRef();
  const thumbRef = React.useRef();
  const diff = React.useRef();

  const handleMouseClick = (pos) => {
    onChange(pos)
  };

  const handleMouseClickSlider = event => {

  };

  const sliderSpots = (spots) => {
    return Array.from({length: spots}, (item, i) => (
      <StyledThumb ref={thumbRef} onClick={() => handleMouseClick(i+1)} position={i} spots={spots} key={i} className={i+1 === position ? 'selected' : ''} />
    ));
  };

  return(
    <div>
      <StyledSlider ref={sliderRef} onClick={handleMouseClickSlider}>
        {sliderSpots(spots)}
      </StyledSlider>
    </div>
  );
};

const Dices = () => {
  const [spots, setSpots] = useState(5);
  const [sides, setSides] = useState([]);

  const updateSpots = (s) => {
    setSpots(s);
    setSides([...Array(s).keys()]);
  };

  const renderedDice = () => {
    return Array.from({length: spots}, (item, i) => (
      <span key={i} className={"dice dice_" + i + " dice__side_" + (sides[i] || 1) } />
    ));
  };

  const rollDice = () => {
    let res = []
    for(let i = 0; i < spots; i++) {
      res.push( Math.floor((Math.random() * 6) + 1) )
    }
    setSides(res)
  }

  return <div className="dices">
    <Slider spots={8} onChange={updateSpots} position={spots} />
    <div className="dices__area">
      <div className="dices__wrapper">
        <Roll className="button" onClick={rollDice}>Roll</Roll>
        {renderedDice()}
      </div>
    </div>
  </div>
}

export default Dices;

