import React from 'react';

import ContextPlaylist from './ContextPlaylist';

function ContextSwitch(props) {
  const { content } = props;

  switch (content.type) {
    case 'playlist':
      return <ContextPlaylist content={content} />;
    default:
      return '';
  }
}

export default ContextSwitch;
