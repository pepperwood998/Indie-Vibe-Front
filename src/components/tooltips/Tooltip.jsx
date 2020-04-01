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
      <span className={tooltipTextClasses}>{props.tooltip}</span>
    </div>
  );
}

export default Tooltip;
