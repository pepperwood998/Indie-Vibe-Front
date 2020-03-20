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
  const { content } = props;

  return (
    <ul>
      <li>
        <LinkWhiteColor>Add to queue</LinkWhiteColor>
      </li>
      <li>
        <LinkWhiteColor>Manage</LinkWhiteColor>
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

export default ContextRelease;
