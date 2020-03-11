import React from 'react';

function FileLabel(props) {
  let label = props.children;
  let classes = [
    'input-label link-bright-gray font-short-big font-gray-light',
    props.className
  ].join(' ');

  if (props.error) {
    classes += ' input-error';
    if (!props.keep) label = props.errMessage;
  }

  return (
    <label className={classes} htmlFor={props.for}>
      {label}
    </label>
  );
}

export default FileLabel;
