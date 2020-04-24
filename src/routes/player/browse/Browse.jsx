import React from 'react';
import { RouteAuthorized } from '../../../components/custom-routes';
import { NavigationTab } from '../../../components/navigation';
import { ROUTES } from '../../../config/RoleRouting';
import { TemplateNavPage } from '../template';
import General from './General';
import Genres from './Genres';
import Releases from './Releases';

function Browse(props) {
  const { browse } = ROUTES.player;
  const tab = {
    general: ['General', General],
    genres: ['Genres', Genres],
    releases: ['New releases', Releases]
  };

  const nav = (
    <NavigationTab
      items={Object.keys(tab).map(key => ({
        href: browse[key][0],
        label: tab[key][0]
      }))}
    />
  );

  const body = (
    <React.Fragment>
      {Object.keys(tab).map((key, index) => (
        <RouteAuthorized
          exact
          component={tab[key][1]}
          path={browse[key][0]}
          roleGroup={browse[key][1]}
          key={index}
        />
      ))}
    </React.Fragment>
  );

  return <TemplateNavPage nav={nav} body={body} title='Browse' />;
}

export default Browse;
