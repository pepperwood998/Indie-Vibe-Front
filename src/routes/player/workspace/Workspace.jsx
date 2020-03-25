import React, { useState, useEffect, useRef } from 'react';

import { ArtistRoute } from '../../../components/custom-routes';
import { NavigationTab } from '../../../components/navigation';
import { TemplateNavPage } from '../template';
import Upload from './Upload';
import Releases from './Releases';
import Statistics from './Statistics';

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
      <ArtistRoute path='/player/workspace/statistic' component={Statistics} />
      <ArtistRoute path='/player/workspace/upload' component={Upload} />
    </React.Fragment>
  );

  return <TemplateNavPage nav={nav} body={body} />;
}

export default Workspace;
