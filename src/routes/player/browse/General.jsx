import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from '../../../assets/svgs';
import {
  CollectionMain,
  CollectionWide
} from '../../../components/collections';
import { NavLinkColor } from '../../../components/links';
import { AuthContext } from '../../../contexts';
import { browseGeneral } from '../../../apis/API';

function General(props) {
  const { state: authState } = useContext(AuthContext);

  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({ releases: [], collections: [] });

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

  return (
    <div className='browse-general fadein'>
      <div className='releases'>
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
      </div>
      <div className='playlists-collections'>
        {data.collections.map((collection, index) => {
          const { genre, items } = collection;
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
        })}
      </div>
    </div>
  );
}

export default General;
