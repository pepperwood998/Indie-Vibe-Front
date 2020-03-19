import React from 'react';
import { LinkWhiteColor } from '../links';

function ContextPlaylist(props) {
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
          <LinkWhiteColor>Delete</LinkWhiteColor>
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

export default ContextPlaylist;
