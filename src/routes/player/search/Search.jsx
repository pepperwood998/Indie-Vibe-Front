import React, { useState, useEffect } from 'react';

import { NavigationTab } from '../../../components/navigation';
import { TemplateNavPage } from '../template';
import { UserRoute } from '../../../components/custom-routes';
import { capitalize } from '../../../utils/Common';
import { NavLinkColor } from '../../../components/links';
import CollecionMain from '../../../components/collections/CollectionMain';

import { ArrowRight } from '../../../assets/svgs';

function Search() {
  const nav = (
    <NavigationTab
      items={[
        {
          href: ['/player/search', '/player/search/general'],
          label: 'General'
        },
        {
          href: '/player/search/tracks',
          label: 'Tracks'
        },
        {
          href: '/player/search/artists',
          label: 'Arists'
        },
        {
          href: '/player/search/releases',
          label: 'Releases'
        },
        {
          href: '/player/search/playlists',
          label: 'Playlists'
        },
        {
          href: '/player/search/profiles',
          label: 'Profiles'
        },
        {
          href: '/player/search/genres',
          label: 'Genres'
        }
      ]}
    />
  );

  const test = {
    tracks: {
      items: [],
      offset: 0,
      limit: 0,
      total: 0
    },
    artists: {
      items: [],
      offset: 0,
      limit: 0,
      total: 0
    },
    releases: {
      items: [],
      offset: 0,
      limit: 0,
      total: 0
    },
    playlists: {
      items: [
        {
          id: '2834j9238u489gu3',
          title: 'Acoustic Chill',
          type: 'playlist',
          relation: ['favorite'],
          description: 'N/A'
        },
        {
          id: '2834j9238u489gu3',
          title: 'Acoustic Chill',
          type: 'playlist',
          relation: ['own'],
          description: 'N/A'
        }
      ],
      offset: 0,
      limit: 10,
      total: 20
    },
    profiles: {
      items: [],
      offset: 0,
      limit: 0,
      total: 0
    },
    genres: {
      items: [],
      offset: 0,
      limit: 0,
      total: 0
    }
  };
  const body = (
    <React.Fragment>
      <UserRoute
        exact
        path={['/player/search', '/player/search/general']}
        component={General}
        data={test}
      />
      {Object.keys(test).map((key, index) => (
        <UserRoute
          path={`/player/search/${key}`}
          component={Mono}
          type={key.substr(0, key.length - 1)}
          data={test[key]}
          key={index}
        />
      ))}
    </React.Fragment>
  );

  return <TemplateNavPage nav={nav} body={body} />;
}

function General(props) {
  const { data } = props;

  const render = data
    ? Object.keys(data).map((key, index) => {
        if (!data[key].items.length) return '';

        let type = key.substr(0, key.length - 1);
        return (
          <CollecionMain
            header={
              <NavLinkColor
                href={`/player/search/${type}`}
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

function Mono(props) {
  console.log(props.data);
  const { type } = props;
  const [data, setData] = useState({
    items: props.items,
    offset: props.offset,
    limit: props.limit,
    total: props.total
  });

  const temp = props.data;

  return (
    <CollecionMain
      header={
        temp.total > 0
          ? temp.total + ` ${type}s`
          : `No results for ${capitalize(type)}`
      }
      data={temp}
      type={type}
    />
  );
}

export default Search;
