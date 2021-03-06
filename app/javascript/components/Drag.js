import React from "react";
import PropTypes from "prop-types";
// import * as dropEffects from "./dropEffects";
import {takeOwnership} from "../state/CardState"

const draggingStyle = {
    opacity: 0.25,
};

const Drag = props => {
    const [isDragging, setIsDragging] = React.useState(false);
    const image = React.useRef(null);

    React.useEffect(() => {
        image.current = null;
        if (props.dragImage) {
            image.current = new Image();
            image.current.src = props.dragImage;
        }
    }, [props.dragImage]);

    const startDrag = ev => {
        setIsDragging(true);
        let [objectLocator, locationId, stack] = props.dataItem;
        takeOwnership({objectLocator: objectLocator})
        ev.dataTransfer.setData("drag-item", props.dataItem);
        ev.dataTransfer.effectAllowed = props.dropEffect;
        if (image.current) {
            ev.dataTransfer.setDragImage(image.current, 0, 0);
        }
    };

    const dragEnd = () => setIsDragging(false);

    return (
        <div className={props.className}
             onClick={props.onClick}
             style={isDragging ? draggingStyle : {}}
             draggable
             onDragStart={startDrag}
             onDragEnd={dragEnd}>
            {props.children}
        </div>
    );
};

Drag.propTypes = {
    dataItem: PropTypes.array.isRequired,
    dragImage: PropTypes.string,
    dropEffect: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

Drag.defaultProps = {
    dragImage: null,
    // dropEffect: dropEffects.All,
};

export default Drag;
