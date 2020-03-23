import React, { useState } from 'react';
import { UserRoute } from '../../../components/custom-routes';
import { GroupProfileBox } from '../../../components/groups';
import { NavigationTab } from '../../../components/navigation';
import { TemplateNavPage } from '../template';
import ArtistAbout from './ArtistAbout';
import ArtistDefault from './ArtistDefault';

function Artist(props) {
  const { id } = props.match.params;

  const [collapsed, setCollapsed] = useState(false);
  const [artist, setArtist] = useState({});

  const handleScrollOver = over => {
    setCollapsed(over);
  };

  const handleProfile = artist => {
    setArtist(artist);
  };

  const header = (
    <GroupProfileBox
      id={id}
      collapsed={collapsed}
      type='artist'
      handleProfile={handleProfile}
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
  const body = (
    <React.Fragment>
      <UserRoute exact path='/player/artist/:id' component={ArtistDefault} />
      <UserRoute
        exact
        path='/player/artist/:id/about'
        component={ArtistAbout}
        artist={artist}
      />
    </React.Fragment>
  );

  return (
    <TemplateNavPage
      header={header}
      nav={nav}
      body={body}
      handleScrollOver={handleScrollOver}
    />
  );
}

export default Artist;
