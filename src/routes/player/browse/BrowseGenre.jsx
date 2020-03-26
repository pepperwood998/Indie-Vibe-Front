import React, { useContext, useEffect, useState } from 'react';
import { browseGenre } from '../../../apis/API';
import { ArrowRight } from '../../../assets/svgs';
import { CollectionMain } from '../../../components/collections';
import { NavLinkColor } from '../../../components/links';
import { AuthContext } from '../../../contexts';

function BrowseGenre(props) {
  const { state: authState } = useContext(AuthContext);

  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({
    genre: {},
    playlists: [],
    releases: []
  });

  const { id } = props.match.params;

  useEffect(() => {
    browseGenre(authState.token, id)
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success') {
          setData({ ...data, ...res.data });
        } else {
          throw 'Error';
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, [id]);

  return firstRender ? (
    ''
  ) : (
    <div className='browse-genre-overview content-page fadein'>
      <div className='browse-header'>
        <span className='font-short-extra font-weight-bold font-white'>
          {data.genre.name}
        </span>
      </div>
      <div className='mono-page genre-content'>
        <CollectionMain
          header={
            <NavLinkColor
              href={`/player/genre/${id}/playlists`}
              className='header-title font-white'
            >
              Editor's curated
              <ArrowRight />
            </NavLinkColor>
          }
          items={data.playlists}
          type='playlist'
        />
        <CollectionMain
          header={
            <NavLinkColor
              href={`/player/genre/${id}/releases`}
              className='header-title font-white'
            >
              New releases
              <ArrowRight />
            </NavLinkColor>
          }
          items={data.releases}
          type='release'
        />
      </div>
    </div>
  );
}

export default BrowseGenre;
