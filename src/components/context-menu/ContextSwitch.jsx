import React from 'react';

import ContextPlaylist from './ContextPlaylist';
import ContextRelease from './ContextRelease';
import ContextUser from './ContextUser';
import ContextTrack from './ContextTrack';

function ContextSwitch(props) {
  const { content } = props;

  switch (content.type) {
    case 'track':
      return <ContextTrack {...props} />;
    case 'playlist':
      return <ContextPlaylist {...props} />;
    case 'release':
      return <ContextRelease {...props} />;
    case 'profile':
    case 'artist':
      return <ContextUser {...props} />;
    default:
      return '';
  }
}

export default ContextSwitch;
