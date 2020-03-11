import React, { useState, useEffect, useRef } from 'react';

import { ArtistRoute } from '../../../components/custom-routes';
import { NavigationTab } from '../../../components/navigation';
import { TemplateNavPage } from '../template';
import Upload from './Upload';

function Workspace() {
  const nav = (
    <NavigationTab
      items={[
        {
          href: ['/player/workspace', '/player/workspace/releases'],
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
  );

  const body = (
    <React.Fragment>
      <ArtistRoute
        exact
        path={['/player/workspace', '/player/workspace/releases']}
        component={Releases}
      />
      <ArtistRoute path='/player/workspace/statistic' component={Statistic} />
      <ArtistRoute path='/player/workspace/upload' component={Upload} />
    </React.Fragment>
  );

  return <TemplateNavPage nav={nav} body={body} />;
}

function Releases() {
  return <div className='workspace-releases'></div>;
}

function Statistic() {
  return <div className='workspace-statistic'></div>;
}

export default Workspace;
