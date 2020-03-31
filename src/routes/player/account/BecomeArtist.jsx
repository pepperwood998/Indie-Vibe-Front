import React from 'react';
import { GroupReleaseUpload } from '../../../components/groups';

function BecomeArtist() {
  return (
    <div className='account-baa fadein content-padding'>
      <div className=' body__bound'>
        <GroupReleaseUpload baa={true} />
      </div>
    </div>
  );
}

export default BecomeArtist;
