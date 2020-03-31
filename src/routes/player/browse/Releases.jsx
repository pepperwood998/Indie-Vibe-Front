import React, { useContext, useState, useEffect } from 'react';
import { ArrowRight } from '../../../assets/svgs';
import { CollectionMain } from '../../../components/collections';
import { NavLinkColor } from '../../../components/links';
import { AuthContext, LibraryContext } from '../../../contexts';
import { browseReleases } from '../../../apis/API';
import { useEffectSkip } from '../../../utils/Common';
import GroupEmpty from '../../../components/groups/GroupEmpty';

function Releases(props) {
  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState([]);

  // effect: init
  useEffect(() => {
    browseReleases(authState.token)
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

  // effect-skip: favorite
  useEffectSkip(() => {
    const { ctxFav } = libState;
    const collections = [...data];

    collections.some(group => {
      const { items } = group;
      items.some(item => {
        if (ctxFav.id === item.id) {
          item.relation = [...ctxFav.relation];
          return true;
        }
      });
    });

    setData(collections);
  }, [libState.ctxFav]);

  return firstRender ? (
    ''
  ) : (
    <GroupEmpty isEmpty={!data.length} message='No new releases available.'>
      <div className='browse-releases fadein content-padding'>
        <div className='header'>
          <span className='font-short-extra font-weight-bold font-white'>
            New releases by Genres
          </span>
        </div>
        {data.map((collection, index) => {
          const { genre, items } = collection;
          if (items.length) {
            return (
              <CollectionMain
                header={
                  <NavLinkColor
                    href={`/player/genre/${genre.id}/releases`}
                    className='header-title font-white'
                  >
                    {genre.name}
                    <ArrowRight />
                  </NavLinkColor>
                }
                items={items}
                key={index}
              />
            );
          }

          return '';
        })}
      </div>
    </GroupEmpty>
  );
}

export default Releases;
