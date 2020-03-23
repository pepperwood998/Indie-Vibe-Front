import React from 'react';

import { NavigationTab } from '../../../components/navigation';
import { UserRoute } from '../../../components/custom-routes';
import { TemplateNavPage } from '../template';
import Mono from './Mono';
import General from './General';
import { GroupProfileBox } from '../../../components/groups';
import LibraryPlaylists from './LibraryPlaylists';

function Library(props) {
  const { id } = props.match.params;

  const nav = (
    <React.Fragment>
      <GroupProfileBox id={id} />
      <NavigationTab
        items={[
          {
            href: `/player/library/${id}`,
            label: 'General'
          },
          {
            href: `/player/library/${id}/tracks`,
            label: 'Favorite songs'
          },
          {
            href: `/player/library/${id}/playlists`,
            label: 'Playlists'
          },
          {
            href: `/player/library/${id}/releases`,
            label: 'Releases'
          },
          {
            href: `/player/library/${id}/artists`,
            label: 'Artists'
          },
          {
            href: `/player/library/${id}/followings`,
            label: 'Followings'
          },
          {
            href: `/player/library/${id}/followers`,
            label: 'Followers'
          }
        ]}
      />
    </React.Fragment>
  );

  const tabs = ['tracks', 'releases', 'artists', 'followings', 'followers'];

  const body = (
    <React.Fragment>
      <UserRoute exact path='/player/library/:id' component={General} />
      <UserRoute
        exact
        path='/player/library/:id/playlists'
        component={LibraryPlaylists}
      />
      {tabs.map((value, index) => (
        <UserRoute
          exact
          path={`/player/library/:id/${value}`}
          component={Mono}
          type={value.substr(0, value.length - 1)}
          key={index}
        />
      ))}
    </React.Fragment>
  );

  return <TemplateNavPage nav={nav} body={body} />;
}

export default Library;
