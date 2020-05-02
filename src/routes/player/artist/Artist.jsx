import React, { useContext, useEffect, useState } from 'react';
import { getArtist } from '../../../apis/API';
import { RouteAuthorized } from '../../../components/custom-routes';
import { GroupEmpty, GroupProfileBox } from '../../../components/groups';
import { NavigationTab } from '../../../components/navigation';
import { ROUTES } from '../../../config/RoleRouting';
import { AuthContext } from '../../../contexts';
import { TemplateNavPage } from '../template';
import ArtistAbout from './ArtistAbout';
import ArtistDefault from './ArtistDefault';

function Artist(props) {
  const { state: authState } = useContext(AuthContext);

  const [firstRender, setFirstRender] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [artist, setArtist] = useState({});

  const { id } = props.match.params;

  const handleScrollOver = over => {
    setCollapsed(over);
  };

  useEffect(() => {
    setFirstRender(true);
    getArtist(authState.token, id)
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success') {
          setArtist({ ...artist, ...res.data });
        } else {
          throw 'Error';
        }
      })
      .catch(err => {
        setFirstRender(false);
        console.error(err);
      });
  }, [id]);

  const header = (
    <GroupProfileBox
      collapsed={collapsed}
      data={artist}
      loading={firstRender}
    />
  );
  const nav = (
    <NavigationTab
      items={[
        {
          href: `/player/artist/${id}`,
          label: 'Discography'
        },
        {
          href: `/player/artist/${id}/about`,
          label: 'About'
        }
      ]}
    />
  );

  const { artist: artistRoute } = ROUTES.player;
  const body = (
    <React.Fragment>
      <RouteAuthorized
        exact
        component={ArtistDefault}
        path={artistRoute.discography[0]}
        roleGroup={artistRoute.discography[1]}
      />
      <RouteAuthorized
        exact
        component={ArtistAbout}
        path={artistRoute.about[0]}
        roleGroup={artistRoute.about[1]}
        artist={artist}
      />
    </React.Fragment>
  );

  return firstRender ? (
    <TemplateNavPage header={header} nav={nav} body={body} />
  ) : (
    <GroupEmpty
      isEmpty={!artist.id || artist.role.id !== 'r-artist'}
      message='Artist not found.'
    >
      <TemplateNavPage
        header={header}
        nav={nav}
        body={body}
        handleScrollOver={handleScrollOver}
        title={`Artist - ${artist.displayName}`}
      />
    </GroupEmpty>
  );
}

export default Artist;
