import React, { useState } from 'react';

import { NavigationTab } from '../../../components/navigation';
import { TemplateNavPage } from '../template';
import { UserRoute } from '../../../components/custom-routes';
import General from './General';
import Mono from './Mono';

function Search() {
  const nav = (
    <NavigationTab
      items={[
        {
          href: ['/player/search', '/player/search/general'],
          label: 'General'
        },
        {
          href: '/player/search/tracks',
          label: 'Tracks'
        },
        {
          href: '/player/search/artists',
          label: 'Arists'
        },
        {
          href: '/player/search/releases',
          label: 'Releases'
        },
        {
          href: '/player/search/playlists',
          label: 'Playlists'
        },
        {
          href: '/player/search/profiles',
          label: 'Profiles'
        },
        {
          href: '/player/search/genres',
          label: 'Genres'
        }
      ]}
    />
  );
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
      <UserRoute
        exact
        path={['/player/search', '/player/search/general']}
        component={General}
      />
      {tabs.map((value, index) => (
        <UserRoute
          path={`/player/search/${value}`}
          component={Mono}
          type={value.substr(0, value.length - 1)}
          key={index}
        />
      ))}
    </React.Fragment>
  );

  return <TemplateNavPage nav={nav} body={body} />;
}

export default Search;
