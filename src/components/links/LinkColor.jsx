import React from 'react';

function LinkColor({ label = 'Enter', href = '#', active = false }) {
  let classes = 'link-blue-main font-short-b font-white';
  if (active) {
    classes += ' active';
  }

  return <a href={href} className={classes}>{label}</a>;
}

export default LinkColor;
