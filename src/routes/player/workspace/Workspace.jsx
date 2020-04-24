import React from 'react';
import { RouteAuthorized } from '../../../components/custom-routes';
import { NavigationTab } from '../../../components/navigation';
import { ROUTES } from '../../../config/RoleRouting';
import { TemplateNavPage } from '../template';
import Releases from './Releases';
import Statistics from './Statistics';
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

  const { workspace } = ROUTES.player;

  const body = (
    <React.Fragment>
      <RouteAuthorized
        exact
        component={Releases}
        path={workspace.releases[0]}
        roleGroup={workspace.releases[1]}
      />
      <RouteAuthorized
        exact
        component={Statistics}
        path={workspace.statistics[0]}
        roleGroup={workspace.statistics[1]}
      />
      <RouteAuthorized
        exact
        component={Upload}
        path={workspace.upload[0]}
        roleGroup={workspace.upload[1]}
      />
    </React.Fragment>
  );

  return <TemplateNavPage nav={nav} body={body} title='Your Workspace' />;
}

export default Workspace;
