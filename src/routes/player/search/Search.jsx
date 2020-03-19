import React from 'react';

import { NavigationTab } from '../../../components/navigation';
import { TemplateNavPage } from '../template';
import { UserRoute } from '../../../components/custom-routes';
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
      <UserRoute exact path='/player/search/:key' component={General} />
      {tabs.map((value, index) => (
        <UserRoute
          exact
          path={`/player/search/:key/${value}`}
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
