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
        <div className='p-1'>
          <span>{props.tooltip}</span>
        </div>
      </div>
    </div>
  );
}

export default Tooltip;
