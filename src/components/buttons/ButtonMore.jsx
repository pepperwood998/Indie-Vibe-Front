import React, { useState, useEffect, useRef } from 'react';

import { ButtonIcon } from '.';
import { MoreIcon } from '../../assets/svgs';
import { ContextPlaylist } from '../context-menu';

function ButtonMore(props) {
  const [showed, setShowed] = useState(false);

  const menuRef = useRef();

  const handleShowed = () => {
    if (showed) return;

    setShowed(true);
    document.addEventListener('click', handleClosed);
  };

  const handleClosed = e => {
    if (!menuRef.current.contains(e.target)) {
      setShowed(false);
      document.removeEventListener('click', handleClosed);
    }
  };

  return (
    <div className='button-more-wrapper'>
      <ButtonIcon onClick={handleShowed}>
        <MoreIcon />
      </ButtonIcon>
      <div ref={menuRef}>
        {showed ? <ContextPlaylist className={props.className} /> : ''}
      </div>
    </div>
  );
}

export default ButtonMore;
