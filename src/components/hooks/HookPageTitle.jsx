import { useContext, useEffect } from 'react';
import { StreamContext } from '../../contexts';

function usePageTitle(title = '', ready = false) {
  const { state: streamState } = useContext(StreamContext);
  const { title: trackTitle = '', artists = [] } = streamState.info;

  useEffect(() => {
    if (streamState.currentSongIndex < 0) {
      if (ready) {
        document.title = title;
      }
    } else {
      document.title = `${trackTitle} - ${artists
        .map(artist => artist.displayName)
        .join(', ')}`;
    }
  }, [ready, streamState.info]);
}

export default usePageTitle;
