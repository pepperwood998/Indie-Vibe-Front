import React from 'react';
import { Link } from 'react-router-dom';
import { NavLinkUnderline } from '../../components/links';

import AvatarPlaceholder from '../../assets/imgs/placeholder.png';
import { FavoriteIcon } from '../../assets/svgs';

function Bottom() {
  return (
    <div className='now-playing-bar'>
      <div className='now-playing-bar__left'>
        <NowPayingLeft />
      </div>
      <div className='now-playing-bar__middle'>
        <NowPayingMiddle />
      </div>
      <div className='now-playing-bar__right'></div>
    </div>
  );
}

function NowPayingLeft() {
  return (
    <div className='now-playing'>
      <div className='now-playing__cover-container'>
        <Link to='/player'>
          <img src={AvatarPlaceholder} />
        </Link>
      </div>
      <div className='now-playing__info'>
        <NavLinkUnderline
          href='/player'
          className='font-short-regular font-weight-bold font-white'
        >
          Muông Thú
        </NavLinkUnderline>
        <NavLinkUnderline
          href='/player'
          className='font-short-s font-gray-light'
        >
          Cá Hồi Hoang
        </NavLinkUnderline>
      </div>
      <div className='now-playing__action'>
        <FavoriteIcon />
      </div>
    </div>
  );
}

function NowPayingMiddle() {
  return <div></div>;
}

function NowPayingRight() {}

export default Bottom;
