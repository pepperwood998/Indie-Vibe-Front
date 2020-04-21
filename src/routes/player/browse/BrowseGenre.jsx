import React, { useContext, useEffect, useState } from 'react';
import { browseGenre } from '../../../apis/API';
import { ArrowRight } from '../../../assets/svgs';
import { CollectionMain } from '../../../components/collections';
import GroupEmpty from '../../../components/groups/GroupEmpty';
import { NavLinkColor } from '../../../components/links';
import { AuthContext, LibraryContext } from '../../../contexts';
import { useEffectSkip } from '../../../utils/Common';
import TemplateBannerPage from '../template/TemplateBannerPage';

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
    <TemplateBannerPage
      title={data.genre.name}
      bannerBg={data.genre.thumbnail}
      body={
        <GroupEmpty isEmpty={isEmpty} message='No browsing for this genre'>
          <div className='genre-content content-padding flex-1'>
            {!data.playlists.length ? (
              ''
            ) : (
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
              />
            )}
            {!data.releases.length ? (
              ''
            ) : (
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
              />
            )}
          </div>
        </GroupEmpty>
      }
    />
  );
}

export default BrowseGenre;
