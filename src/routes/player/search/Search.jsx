import React, { useState, useEffect } from 'react';

import { NavigationTab } from '../../../components/navigation';
import { TemplateNavPage } from '../template';
import { UserRoute } from '../../../components/custom-routes';
import { capitalize } from '../../../utils/Common';
import { NavLinkColor } from '../../../components/links';
import {
  CollectionMain,
  CollectionTracks
} from '../../../components/collections';

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
      items: [
        {
          id: 'vq98jf093f9032fj0',
          title: 'Vung vong veo',
          artists: [
            {
              id: '093jf930f92j',
              displayName: 'Hà Hồ'
            },
            {
              id: 'f093j92jf2',
              displayName: 'Misuka'
            }
          ]
        }
      ],
      offset: 0,
      limit: 2,
      total: 40
    },
    artists: {
      items: [
        {
          id: 'j89349823hf982',
          displayName: 'Vũ.',
          type: 'artist',
          relation: ['following'],
          followersCount: 10
        },
        {
          id: '92f8fh92h39fh2',
          displayName: 'Vân',
          type: 'artist',
          relation: [],
          followersCount: 1000
        }
      ],
      offset: 0,
      limit: 2,
      total: 10
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
      items: [
        {
          id: '09j0evjqw9vj2',
          displayName: 'Tuan',
          type: 'profile',
          relation: ['following']
        },
        {
          id: '0c129hcj0j3209c',
          displayName: 'Tuan',
          type: 'profile',
          relation: []
        }
      ],
      offset: 0,
      limit: 2,
      total: 20
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

function Mono(props) {
  const { type } = props;
  const [data, setData] = useState({
    items: props.data.items,
    offset: props.data.offset,
    limit: props.data.limit,
    total: props.data.total
  });

  if (type === 'track') {
    return (
      <CollectionTracks
        header={
          data.total > 0
            ? data.total + ` ${type}s`
            : `No results for ${capitalize(type)}`
        }
        data={data}
      />
    );
  }

  return (
    <CollectionMain
      header={
        data.total > 0
          ? data.total + ` ${type}s`
          : `No results for ${capitalize(type)}`
      }
      data={data}
      type={type}
    />
  );
}

export default Search;
