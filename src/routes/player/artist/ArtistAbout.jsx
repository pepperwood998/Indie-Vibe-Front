import React from 'react';
import { GroupEmpty } from '../../../components/groups';
import { ICON } from '../../../components/groups/GroupEmpty';

function ArtistAbout(props) {
  const { artist } = props;

  return (
    <GroupEmpty
      isEmpty={!artist.biography}
      message='No biography.'
      iconType={ICON.DOCUMENT}
    >
      <div className='fadein content-padding'>
        <div className='body__bound'>
          <pre className='font-short-big font-white'>{artist.biography}</pre>
        </div>
      </div>
    </GroupEmpty>
  );
}

export default ArtistAbout;
