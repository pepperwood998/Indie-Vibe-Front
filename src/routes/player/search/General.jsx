import React from 'react';

import { capitalize } from '../../../utils/Common';
import { NavLinkColor } from '../../../components/links';
import { CollectionTracks, CollectionMain } from '../../../components/collections';

import { ArrowRight } from '../../../assets/svgs';

function General(props) {
  const { data } = props;

  const render = data
    ? Object.keys(data).map((key, index) => {
        if (!data[key].items.length) return '';

        let type = key.substr(0, key.length - 1);
        if (type === 'track') {
          return (
            <CollectionTracks
              header={
                <NavLinkColor
                  href={`/player/search/${key}`}
                  className='header-title font-white'
                >
                  {capitalize(key)}
                  <ArrowRight />
                </NavLinkColor>
              }
              data={data[key]}
              type='search'
              short={true}
              key={index}
            />
          );
        }

        return (
          <CollectionMain
            header={
              <NavLinkColor
                href={`/player/search/${key}`}
                className='header-title font-white'
              >
                {capitalize(key)}
                <ArrowRight />
              </NavLinkColor>
            }
            data={data[key]}
            type={type}
            short={true}
            key={index}
          />
        );
      })
    : '';

  return render;
}

export default General;
