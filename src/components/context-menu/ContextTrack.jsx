import React, { useContext } from 'react';

import { LinkWhiteColor } from '../links';
import { LibraryContext } from '../../contexts';

function ContextTrack(props) {
  const { content } = props;

  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  return (
    <div className='context-menu'>
      <ul>
        <li>
          <LinkWhiteColor>Add to queue</LinkWhiteColor>
        </li>
        <li>
          <LinkWhiteColor>Discover Artist</LinkWhiteColor>
        </li>
        <li>
          <LinkWhiteColor>View Release</LinkWhiteColor>
        </li>
        <li>
          <LinkWhiteColor>Show credits</LinkWhiteColor>
        </li>
        <li>
          <LinkWhiteColor>Add to Playlist</LinkWhiteColor>
        </li>
        <li>
          {Array.isArray(content.relation) &&
          content.relation.includes('favorite') ? (
            <LinkWhiteColor
              onClick={() => {
                {
                  libDispatch(libActions.toggleCtxFavorite('unfavorite'));
                }
              }}
            >
              Remove from Favorite
            </LinkWhiteColor>
          ) : (
            <LinkWhiteColor
              onClick={() => {
                {
                  libDispatch(libActions.toggleCtxFavorite('favorite'));
                }
              }}
            >
              Add to Favorite
            </LinkWhiteColor>
          )}
        </li>
      </ul>
    </div>
  );
}

export default ContextTrack;
