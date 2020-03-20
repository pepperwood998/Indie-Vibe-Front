import React, { useContext } from 'react';

import { LinkWhiteColor } from '../links';
import { LibraryContext } from '../../contexts';

function ContextPlaylist(props) {
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
  const { content } = props;

  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  return (
    <ul>
      <li>
        <LinkWhiteColor>Add to queue</LinkWhiteColor>
      </li>
      <li>
        {content.status === 'public' ? (
          <LinkWhiteColor>Set private</LinkWhiteColor>
        ) : (
          <LinkWhiteColor>Set public</LinkWhiteColor>
        )}
      </li>
      <li>
        <LinkWhiteColor>Edit</LinkWhiteColor>
      </li>
      <li>
        <LinkWhiteColor
          onClick={() => {
            {
              libDispatch(libActions.deletePlaylist(content.id));
            }
          }}
        >
          Delete
        </LinkWhiteColor>
      </li>
    </ul>
  );
}

function Other(props) {
  const { content, handlers } = props;

  return (
    <ul>
      <li>
        <LinkWhiteColor>Add to queue</LinkWhiteColor>
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
    </ul>
  );
}

export default ContextPlaylist;
