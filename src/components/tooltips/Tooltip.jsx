import React from 'react';

function Tooltip(props) {
  let tooltipTextClasses = 'tooltip-text';
  if (props.pos) {
    tooltipTextClasses += ` ${props.pos}`;
  } else {
    tooltipTextClasses += ' top';
  }

  return (
    <div className='custom-tooltip'>
      {props.children}
      <div className={tooltipTextClasses}>
        <span>{props.tooltip}</span>
      </div>
    </div>
  );
}

export default Tooltip;
