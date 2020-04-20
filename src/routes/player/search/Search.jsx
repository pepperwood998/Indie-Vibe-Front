import React from 'react';
import { RouteAuthorized } from '../../../components/custom-routes';
import { NavigationTab } from '../../../components/navigation';
import { ROUTES } from '../../../config/RoleRouting';
import { TemplateNavPage } from '../template';
import General from './General';
import Mono from './Mono';

function Search(props) {
  const { key } = props.match.params;

  const nav = (
    <NavigationTab
      type='search'
      items={[
        {
          href: `/player/search/${key}`,
          label: 'General'
        },
        {
          href: `/player/search/${key}/tracks`,
          label: 'Tracks'
        },
        {
          href: `/player/search/${key}/artists`,
          label: 'Arists'
        },
        {
          href: `/player/search/${key}/releases`,
          label: 'Releases'
        },
        {
          href: `/player/search/${key}/playlists`,
          label: 'Playlists'
        },
        {
          href: `/player/search/${key}/profiles`,
          label: 'Profiles'
        },
        {
          href: `/player/search/${key}/genres`,
          label: 'Genres'
        }
      ]}
    />
  );

  const { search } = ROUTES.player;
  const tabs = [
    'tracks',
    'artists',
    'releases',
    'playlists',
    'profiles',
    'genres'
  ];

  const body = (
    <React.Fragment>
      <RouteAuthorized
        exact
        component={General}
        path={search.general[0]}
        roleGroup={search.general[1]}
      />
      {tabs.map((value, index) => (
        <RouteAuthorized
          exact
          component={Mono}
          path={search[value][0]}
          roleGroup={search[value][1]}
          type={value.substr(0, value.length - 1)}
          key={index}
        />
      ))}
    </React.Fragment>
  );

  return <TemplateNavPage nav={nav} body={body} />;
}

export default Search;
