import React from 'react';

import { LinkWhiteColor } from '../links';

function ContextRelease(props) {
  const { content } = props;

  return (
    <div className='context-menu' ref={props.elemRef}>
      {Array.isArray(content.relation) ? (
        content.relation.includes('own') ? (
          <Me {...props} />
        ) : (
          <Other {...props} />
        )
      ) : (
        ''
      )}
    </div>
  );
}

function Me(props) {
  const { content, handlers } = props;

  return (
    <ul>
      <li>{props.AddToQueue}</li>
      <li
        onClick={() => {
          handlers.handleClose();
        }}
      >
        <LinkWhiteColor
          nav={true}
          href={`/player/workspace/release/${content.id}`}
        >
          Manage
        </LinkWhiteColor>
      </li>
      <li>{props.ShareFacebook}</li>
    </ul>
  );
}

function Other(props) {
  const { content, handlers } = props;

  return (
    <ul>
      <li>{props.AddToQueue}</li>
      <li
        onClick={() => {
          handlers.handleClose();
        }}
      >
        <LinkWhiteColor nav={true} href={`/player/artist/${content.artistId}`}>
          Discover Artist
        </LinkWhiteColor>
      </li>
      <li>
        {content.relation.includes('favorite') ? (
          <LinkWhiteColor
            onClick={() => {
              handlers.handleToggleFavorite('unfavorite');
            }}
          >
            Remove from library
          </LinkWhiteColor>
        ) : (
          <LinkWhiteColor
            onClick={() => {
              handlers.handleToggleFavorite('favorite');
            }}
          >
            Add to library
          </LinkWhiteColor>
        )}
      </li>
      <li>{props.ShareFacebook}</li>
    </ul>
  );
}

export default ContextRelease;
