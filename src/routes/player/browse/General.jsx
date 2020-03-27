import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { browseGeneral } from '../../../apis/API';
import { ArrowRight } from '../../../assets/svgs';
import {
  CollectionMain,
  CollectionWide
} from '../../../components/collections';
import { NavLinkColor } from '../../../components/links';
import { AuthContext, LibraryContext } from '../../../contexts';
import { useEffectSkip } from '../../../utils/Common';
import GroupEmpty from '../../../components/groups/GroupEmpty';

function General(props) {
  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({ releases: [], playlists: [] });

  const isEmpty = !data.releases.length && !data.playlists.length;

  // effect: init
  useEffect(() => {
    browseGeneral(authState.token)
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success') {
          setData(res.data);
        } else {
          throw 'Error';
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  // effect-skip: init
  useEffectSkip(() => {
    const { ctxFav } = libState;
    const playlists = [...data.playlists];

    playlists.forEach(group => {
      const { items } = group;
      items.some(item => {
        if (ctxFav.id === item.id) {
          item.relation = [...ctxFav.relation];
          return true;
        }
      });
    });

    setData({ ...data, playlists });
  }, [libState.ctxFav]);

  return firstRender ? (
    ''
  ) : (
    <GroupEmpty isEmpty={isEmpty} message='No available browsing.'>
      <div className='browse-general fadein'>
        <div className='releases'>
          {data.releases.length ? (
            <CollectionWide
              header={
                <NavLink
                  to='/player/browse/releases'
                  className='header-title all-white font-white'
                >
                  New releases
                  <ArrowRight />
                </NavLink>
              }
              items={data.releases}
            />
          ) : (
            ''
          )}
        </div>
        <div className='playlists-collections'>
          {data.playlists.map((collection, index) => {
            const { genre, items } = collection;
            if (items.length) {
              return (
                <CollectionMain
                  header={
                    <NavLinkColor
                      href={`/player/genre/${genre.id}/playlists`}
                      className='header-title font-white'
                    >
                      {genre.name}
                      <ArrowRight />
                    </NavLinkColor>
                  }
                  items={items}
                  type='playlist'
                  key={index}
                />
              );
            }

            return '';
          })}
        </div>
      </div>
    </GroupEmpty>
  );
}

export default General;
