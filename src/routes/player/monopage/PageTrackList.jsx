import React, { useState } from 'react';

import Placeholder from '../../../assets/imgs/placeholder.png';
import { NavLinkUnderline } from '../../../components/links';
import { ButtonMain, ButtonIcon } from '../../../components/buttons';
import { UnFavoriteIcon, MoreIcon } from '../../../assets/svgs';
import { InputForm } from '../../../components/inputs';
import { CollectionTrackTable } from '../../../components/collections';

function TrackList(props) {
  const { type } = props;
  const id = props.match.params.id;

  const [data, setData] = useState({
    tracks: {
      items: [],
      offset: 0,
      limit: 0,
      total: 0
    }
  });

  return (
    <div className='content-page'>
      <div className='mono-page track-list'>
        <div className='track-list__header'>
          <div className='avatar'>
            <img src={Placeholder} />
          </div>
          <div className='info'>
            <div className='info__top'>
              <span className='font-short-extra font-weight-bold font-white'>
                Indie Chill
              </span>
              <div>
                <span className='font-short-regular font-gray-light'>
                  by&nbsp;
                </span>
                <NavLinkUnderline
                  href='#'
                  className='font-short-regular font-white'
                >
                  Tuấn
                </NavLinkUnderline>
              </div>
              <p className='description font-short-big font-white'>
                Relax, hangout, and unwind to songs by artists like Clairo,
                Maxim.
              </p>
            </div>
            <div className='info__bottom font-short-regular font-gray-light'>
              <span>{type.toUpperCase()}</span>
              <span className='dot'>&#8226;</span>
              <span>69 tracks</span>
              <span className='dot'>&#8226;</span>
              <span>852 followers</span>
            </div>
          </div>
        </div>
        <div className='track-list__action'>
          <div className='action'>
            <ButtonMain>PLAY</ButtonMain>
            <ButtonIcon>
              <UnFavoriteIcon />
            </ButtonIcon>
            <ButtonIcon>
              <MoreIcon />
            </ButtonIcon>
          </div>
          <div className='filter'>
            <InputForm placeholder='Filter' />
          </div>
        </div>
        <div className='track-list__content'>
          <CollectionTrackTable data={data.tracks} type={type} />
        </div>
      </div>
    </div>
  );
}

export default TrackList;
