import React, { useContext, useEffect, useState } from 'react';
import { UserRoute } from '../../../components/custom-routes';
import { GroupEmpty, GroupProfileBox } from '../../../components/groups';
import { NavigationTab } from '../../../components/navigation';
import { AuthContext } from '../../../contexts';
import { TemplateNavPage } from '../template';
import ArtistAbout from './ArtistAbout';
import ArtistDefault from './ArtistDefault';
import { getArtist } from '../../../apis/API';

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
        console.error(err);
      });
  }, [id]);

  const header = (
    <GroupProfileBox id={id} collapsed={collapsed} data={artist} />
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

  return firstRender ? (
    ''
  ) : (
    <GroupEmpty isEmpty={!artist.id} message='Artist not found.'>
      <TemplateNavPage
        header={header}
        nav={nav}
        body={body}
        handleScrollOver={handleScrollOver}
      />
    </GroupEmpty>
  );
}

export default Artist;
