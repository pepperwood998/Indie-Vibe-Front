import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from '../../../assets/svgs';
import {
  CollectionMain,
  CollectionWide
} from '../../../components/collections';
import { NavLinkColor } from '../../../components/links';

function General(props) {
  const releases = [
    {
      id: '892j39jf923jf',
      title: 'Intention',
      thumbnail: '',
      artist: {
        id: 'j9283f923f',
        displayName: 'Justin Bieber'
      }
    },
    {
      id: 'f298hf923hf23',
      title: 'Know your words',
      thumbnail: '',
      artist: {
        id: 'j01jf01j290f',
        displayName: 'Khalid'
      }
    },
    {
      id: '93j89239jv923j9',
      title: 'Birthday',
      thumbnail: '',
      artist: {
        id: '029v009v3v',
        displayName: 'Annie marie'
      }
    }
  ];
  const collections = [
    {
      genre: { id: 'r-acoustic', name: 'Acoustic' },
      items: [
        {
          id: 'j02j3c02j392j0',
          title: 'Curator #1',
          description: 'Description for curator #1',
          relation: [],
          type: 'playlist',
          owner: {
            role: {
              id: 'r-curator'
            }
          }
        },
        {
          id: 'fj29j38892j3f',
          title: 'Curator #2',
          description: 'Description for curator #2',
          relation: [],
          type: 'playlist',
          owner: {
            role: {
              id: 'r-curator'
            }
          }
        }
      ]
    }
  ];

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
          items={releases}
        />
      </div>
      <div className='playlists-collections'>
        {collections.map((collection, index) => {
          const { genre, items } = collection;
          return (
            <CollectionMain
              header={
                <NavLinkColor
                  href={`/player/browse/genre/${genre.id}/playlists`}
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
