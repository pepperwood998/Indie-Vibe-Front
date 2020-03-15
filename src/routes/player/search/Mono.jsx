import React, { useState } from 'react';

import {
  CollectionTracks,
  CollectionMain
} from '../../../components/collections';
import { capitalize } from '../../../utils/Common';

function Mono(props) {
  const { type } = props;
  const test = {
    tracks: {
      items: [
        {
          id: 'vq98jf093f9032fj0',
          title: 'Vung vong veo',
          duration: 234000,
          artists: [
            {
              id: '093jf930f92j',
              displayName: 'Hà Hồ Hồ'
            },
            {
              id: 'f093j92jf2',
              displayName: 'Misuka'
            }
          ],
          release: {
            id: 'j0238jf23f023',
            title: 'Sunhi'
          },
          relation: ['favorite']
        },
        {
          id: 'vq98jf093f9032fj0',
          title: 'Vung vong veo',
          duration: 234000,
          artists: [
            {
              id: '093jf930f92j',
              displayName: 'Hà Hồ Hồ'
            },
            {
              id: 'f093j92jf2',
              displayName: 'Misuka'
            }
          ],
          release: {
            id: 'j0238jf23f023',
            title: 'Sunhi'
          },
          relation: []
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
          description: 'Description'
        },
        {
          id: '2834j9238u489gu3',
          title: 'Acoustic Chill',
          type: 'playlist',
          relation: ['own'],
          description: 'Description'
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
  const data = test[`${type}s`];

  if (type === 'track') {
    return (
      <CollectionTracks
        header={
          data.total > 0
            ? data.total + ` ${type}s`
            : `No results for ${capitalize(type)}`
        }
        data={data}
        type='search'
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

export default Mono;
