import React from 'react';

import { LinkWhiteColor } from '../links';

function ContextRelease(props) {
  const { content } = props;

  if (Array.isArray(content.relation)) {
    if (content.relation.includes('own')) {
      return <Me content={content} />;
    }

    return <Other content={content} />;
  } else {
    return '';
  }
}

function Me(props) {
  const { content } = props;

  return (
    <div className='context-menu'>
      <ul>
        <li>
          <LinkWhiteColor>Add to queue</LinkWhiteColor>
        </li>
        <li>
          <LinkWhiteColor>Manage</LinkWhiteColor>
        </li>
      </ul>
    </div>
  );
}

function Other(props) {
  const { content } = props;

  return (
    <div className='context-menu'>
      <ul>
        <li>
          <LinkWhiteColor>Add to queue</LinkWhiteColor>
        </li>
        <li>
          {content.relation.includes('favorite') ? (
            <LinkWhiteColor>Remove from library</LinkWhiteColor>
          ) : (
            <LinkWhiteColor>Add to library</LinkWhiteColor>
          )}
        </li>
      </ul>
    </div>
  );
}

export default ContextRelease;
