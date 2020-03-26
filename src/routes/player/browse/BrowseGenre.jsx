import React, { useContext, useEffect, useState } from 'react';
import { browseGenre } from '../../../apis/API';
import { ArrowRight } from '../../../assets/svgs';
import { CollectionMain } from '../../../components/collections';
import { NavLinkColor } from '../../../components/links';
import { AuthContext, LibraryContext } from '../../../contexts';
import { useEffectSkip } from '../../../utils/Common';
import GroupEmpty from '../../../components/groups/GroupEmpty';

function BrowseGenre(props) {
  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({
    genre: { name: 'Acoustic' },
    playlists: [],
    releases: []
  });

  const { id } = props.match.params;
  const isEmpty = !data.playlists.length && !data.releases.length;

  // effect: init
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

  // effect-skip: favorite
  useEffectSkip(() => {
    const { ctxFav } = libState;
    const targetKey = `${ctxFav.type}s`;
    const collections = [...data[targetKey]];

    collections.some(item => {
      if (ctxFav.id === item.id) {
        item.relation = [...ctxFav.relation];
        return true;
      }
    });

    setData({
      ...data,
      [targetKey]: collections
    });
  }, [libState.ctxFav]);

  return firstRender ? (
    ''
  ) : (
    <div className='browse-genre-overview content-page fadein'>
      <div className='browse-header'>
        <span className='font-short-extra font-weight-bold font-white'>
          {data.genre.name}
        </span>
      </div>

      <GroupEmpty isEmpty={isEmpty} message='No browsing for this genre'>
        <div className='genre-content mono-page content-padding'>
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
      </GroupEmpty>
    </div>
  );
}

export default BrowseGenre;
