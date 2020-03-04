import React from 'react';

function LinkColor({
  label = 'Enter',
  href = '',
  onClick = () => {},
  active = false
}) {
  let classes = 'context-menu__item link-blue-main font-short-b font-white';
  if (active) {
    classes += ' active';
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {label}
      </a>
    );
  } else {
    return (
      <div className={classes} onClick={onClick}>
        {label}
      </div>
    );
  }
}

export default LinkColor;
