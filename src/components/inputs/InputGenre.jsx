import React from 'react';

import { AddIcon } from '../../assets/svgs';

function InputGenre(props) {
  let classes = ['input-genre', props.className].join(' ');

  if (props.error) {
    classes += ' input-error';
  }

  return <AddIcon onClick={props.onClick} className={classes} />;
}

export default InputGenre;
