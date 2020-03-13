import React from 'react';

import { NavLinkUnderline } from '../links';
import { ButtonIcon } from '../buttons';

import Placeholder from '../../assets/imgs/placeholder.png';
import { PlayIcon, FavoriteIcon, MoreIcon } from '../../assets/svgs';

function CardMain(props) {
  return (
    <div className='card-main'>
      <div className='card-main__cover-wrapper'>
        <div className='dummy'></div>
        <img src={Placeholder} className='cover' />
        <div className='action'>
          <ButtonIcon>
            <PlayIcon />
          </ButtonIcon>
          <div className='action__extra'>
            <ButtonIcon>
              <FavoriteIcon />
            </ButtonIcon>
            <ButtonIcon>
              <MoreIcon />
            </ButtonIcon>
          </div>
        </div>
      </div>
      <div className='card-main__info'>
        {/* {props.title} */}
        <NavLinkUnderline
          href='/player'
          className='font-short-big font-weight-bold font-white'
        >
          Halo
        </NavLinkUnderline>
        <div className='content font-short-s font-gray-light'>
          <span>
            {/* {props.content} */}
            <NavLinkUnderline href='#' className='font-gray-light'>
              The 80s has brought so many iconic sound tracks that c sound
              tracks that c sound tracks that
            </NavLinkUnderline>
          </span>
        </div>
      </div>
    </div>
  );
}

export default CardMain;
