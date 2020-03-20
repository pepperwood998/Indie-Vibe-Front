import React from 'react';

import { LinkWhiteColor } from '../links';

function ContextTrack(props) {
  const { content, handlers } = props;

  return (
    <div className='context-menu' ref={props.elemRef}>
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
                handlers.handleToggleFavorite('unfavorite');
              }}
            >
              Remove from Favorite
            </LinkWhiteColor>
          ) : (
            <LinkWhiteColor
              onClick={() => {
                handlers.handleToggleFavorite('favorite');
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
