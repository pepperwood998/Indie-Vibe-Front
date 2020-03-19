import React, { useContext, useRef } from 'react';

import { ButtonIcon } from '.';
import { LibraryContext } from '../../contexts';

import { MoreIcon } from '../../assets/svgs';

function ButtonMore(props) {
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);


  const handleToggleCtxMenu = e => {
    if (libState.ctxMenuOpened) return;

    const { x, y, width, height } = e.target.getBoundingClientRect();
    libDispatch(
      libActions.openCtxMenu({
        content: props.ctxData,
        pos: [x, y + height + 10]
      })
    );
  };

  return (
    <ButtonIcon onClick={handleToggleCtxMenu}>
      <MoreIcon />
    </ButtonIcon>
  );
}

export default ButtonMore;
