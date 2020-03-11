import React, { useState, useEffect, useRef } from 'react';

import { ArtistRoute } from '../../../components/custom-routes';
import { NavigationTab } from '../../../components/navigation';
import Upload from './Upload';

function Workspace() {
  return (
    <div className='content-page workspace-page'>
      <NavigationTab
        items={[
          {
            href: '/player/workspace/releases',
            label: 'Your releases'
          },
          {
            href: '/player/workspace/statistic',
            label: 'Statistic'
          },
          {
            href: '/player/workspace/upload',
            label: 'Publish new Release'
          }
        ]}
      />
      <div className='content-wrapper-scroll'>
        <div className='content-wrapper'>
          <ArtistRoute
            exact
            path={['/player/workspace', '/player/workspace/releases']}
            component={Releases}
          />
          <ArtistRoute
            path='/player/workspace/statistic'
            component={Statistic}
          />
          <ArtistRoute path='/player/workspace/upload' component={Upload} />
        </div>
      </div>
    </div>
  );
}

function Releases() {
  return <div className='workspace-releases'></div>;
}

function Statistic() {
  return <div className='workspace-statistic'></div>;
}



export default Workspace;
