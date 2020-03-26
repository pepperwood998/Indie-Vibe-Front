import React, { useContext, useState, useEffect } from 'react';
import { ArrowRight } from '../../../assets/svgs';
import { CollectionMain } from '../../../components/collections';
import { NavLinkColor } from '../../../components/links';
import { AuthContext } from '../../../contexts';
import { browseReleases } from '../../../apis/API';

function Releases(props) {
  const { state: authState } = useContext(AuthContext);

  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState([]);

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

  return firstRender ? (
    ''
  ) : (
    <div className='browse-releases fadein'>
      <div className='header'>
        <span className='font-short-extra font-weight-bold font-white'>
          New releases by Genres
        </span>
      </div>
      {data.map((collection, index) => {
        const { genre, items } = collection;
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
            type='release'
            key={index}
          />
        );
      })}
    </div>
  );
}

export default Releases;
