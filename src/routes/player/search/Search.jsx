import React from 'react';

import { NavigationTab } from '../../../components/navigation';
import { TemplateNavPage } from '../template';
import { CardMain } from '../../../components/cards';

function Search() {
  const nav = (
    <NavigationTab
      items={[
        {
          href: ['/player/search', '/player/search/genernal'],
          label: 'General'
        },
        {
          href: '/player/search/songs',
          label: 'Songs'
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

  const body = (
    <div className='group-main group-main--extended'>
      <div className='group-main__header'>
        <div className='font-short-extra font-white font-weight-bold'>
          Your heavy rotation
        </div>
      </div>
      <div className='group-main__content'>
        <CardMain className='item' />
        <CardMain className='item' />
        <CardMain className='item' />
        <CardMain className='item' />
        <CardMain className='item' />
      </div>
    </div>
  );

  return <TemplateNavPage nav={nav} body={body} />;
}

export default Search;
