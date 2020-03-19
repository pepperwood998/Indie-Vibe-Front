import React, { useState, useEffect, useContext } from 'react';

import { capitalize, useEffectSkip } from '../../../utils/Common';
import { NavLinkColor } from '../../../components/links';
import { CollectionMain } from '../../../components/collections';
import { AuthContext, LibraryContext } from '../../../contexts';
import { library } from '../../../apis/API';

import { ArrowRight } from '../../../assets/svgs';

function General(props) {
  const { id: userId } = props.match.params;

  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  const [data, setData] = useState({
    playlists: [],
    artists: []
  });

  useEffect(() => {
    library(authState.token, props.match.params.id)
      .then(res => {
        if (res.status === 'success' && res.data) {
          setData({ ...data, ...res.data });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  useEffectSkip(() => {
    const { ctxFav } = libState;
    let target = [...data[`${ctxFav.type}s`]];
    target.some(item => {
      if (ctxFav.id === item.id) {
        item.relation = [...ctxFav.relation];
        return true;
      }
    });
    setData({ ...data, [`${ctxFav.type}s`]: target });
  }, [libState.ctxFav]);

  let exist = Object.keys(data).find(key => data[key].length > 0);
  let render = '';
  if (exist) {
    render = Object.keys(data).map((key, index) => {
      if (data[key].length > 0) {
        let type = key.substr(0, key.length - 1);

        return (
          <CollectionMain
            header={
              <NavLinkColor
                href={`/player/library/${userId}/${key}`}
                className='header-title font-white'
              >
                {capitalize(key)}
                <ArrowRight />
              </NavLinkColor>
            }
            data={{ items: data[key], offset: 0, limit: data[key].length }}
            type={type}
            key={index}
          />
        );
      }
    });
  } else {
    render = (
      <span className='font-short-extra font-white font-weight-bold'>
        Library empty
      </span>
    );
  }

  return render;
}

export default General;
