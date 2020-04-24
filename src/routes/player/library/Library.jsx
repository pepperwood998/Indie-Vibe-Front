import React, { useContext, useEffect, useState } from 'react';
import { getProfile } from '../../../apis/API';
import { RouteAuthorized } from '../../../components/custom-routes';
import { GroupEmpty, GroupProfileBox } from '../../../components/groups';
import { NavigationTab } from '../../../components/navigation';
import { ROUTES } from '../../../config/RoleRouting';
import { AuthContext } from '../../../contexts';
import { TemplateNavPage } from '../template';
import General from './General';
import LibraryPlaylists from './LibraryPlaylists';
import Mono from './Mono';

function Library(props) {
  const { state: authState } = useContext(AuthContext);

  const { id } = props.match.params;

  const [firstRender, setFirstRender] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState({});

  const handleScrollOver = over => {
    setCollapsed(over);
  };

  useEffect(() => {
    setFirstRender(true);
    getProfile(authState.token, id)
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success') {
          setProfile({ ...profile, ...res.data });
        } else {
          throw 'Error';
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, [id]);

  const header = <GroupProfileBox collapsed={collapsed} data={profile} />;

  const nav = (
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
  );

  const { library } = ROUTES.player;
  const tabs = ['tracks', 'releases', 'artists', 'followings', 'followers'];

  const body = (
    <React.Fragment>
      <RouteAuthorized
        exact
        component={General}
        path={library.general[0]}
        roleGroup={library.general[1]}
      />
      <RouteAuthorized
        exact
        component={LibraryPlaylists}
        path={library.playlists[0]}
        roleGroup={library.playlists[1]}
      />
      {tabs.map((value, index) => (
        <RouteAuthorized
          exact
          component={Mono}
          path={library[value][0]}
          roleGroup={library[value][1]}
          type={value.substr(0, value.length - 1)}
          key={index}
        />
      ))}
    </React.Fragment>
  );

  return firstRender ? (
    ''
  ) : (
    <GroupEmpty isEmpty={!profile.id} message='Profile not found.'>
      <TemplateNavPage
        header={header}
        nav={nav}
        body={body}
        handleScrollOver={handleScrollOver}
        title={`Library - ${profile.displayName}`}
      />
    </GroupEmpty>
  );
}

export default Library;
