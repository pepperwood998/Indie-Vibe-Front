import React from 'react';

import ContextPlaylist from './ContextPlaylist';
import ContextRelease from './ContextRelease';
import ContextUser from './ContextUser';
import ContextTrack from './ContextTrack';

function ContextSwitch(props) {
  const { content } = props;

  switch (content.type) {
    case 'track':
      return <ContextTrack content={content} />;
    case 'playlist':
      return <ContextPlaylist content={content} />;
    case 'release':
      return <ContextRelease content={content} />;
    case 'profile':
    case 'artist':
      return <ContextUser content={content} />;
    default:
      return '';
  }
}

export default ContextSwitch;
