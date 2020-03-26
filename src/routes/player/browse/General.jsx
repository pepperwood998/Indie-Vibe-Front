import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from '../../../assets/svgs';
import { CollectionWide } from '../../../components/collections';
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
  const collections = [{}];

  return (
    <div className='browse-general fadein'>
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
  );
}

export default General;
