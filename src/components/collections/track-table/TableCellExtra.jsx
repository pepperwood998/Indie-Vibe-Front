import React, { useContext } from 'react';
import { MoreIcon, PlusIcon } from '../../../assets/svgs';
import { LibraryContext } from '../../../contexts';

function CellExtra(props) {
  const { title } = props;

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
        content: {
          type: 'track',
          id: props.id,
          fromType: props.fromType,
          relation: props.relation,
          releaseId: props.releaseId,
          artistId: props.artistId,
          playlistId: props.playlistId,
          playlistRelation: props.playlistRelation
        },
        pos: [x, y + height + 10]
      })
    );
  };

  const handleBrowsePlaylists = () => {
    libDispatch(libActions.closeCtxMenu());
    libDispatch(libActions.setBrowsePlaylists(true, props.id));
  };

  return (
    <div className='extra right'>
        <PlusIcon
          className='svg--cursor svg--gray-light svg--bright'
          onClick={handleBrowsePlaylists}
        />
        <MoreIcon
          className='svg--cursor svg--gray-light svg--bright'
          onClick={handleToggleCtxMenu}
        />
    </div>
  );
}

export default CellExtra;
