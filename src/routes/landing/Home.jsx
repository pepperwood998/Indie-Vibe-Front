import React from 'react';

import { ButtonFrame, ButtonMain } from '../../components/buttons';
import { LinkColor } from '../../components/links';

import { Logo, Facebook, Instagram, Twitter } from '../../assets/svgs';
import landingIntro from '../../assets/imgs/landing-intro.png';
import cell1 from '../../assets/imgs/cell-1.png';
import cell2 from '../../assets/imgs/cell-2.png';
import cell3 from '../../assets/imgs/cell-3.png';
import cell4 from '../../assets/imgs/cell-4.png';
import cell5 from '../../assets/imgs/cell-5.png';
import cell6 from '../../assets/imgs/cell-6.png';
import './style.scss';

function Home() {
  const footer = {
    'quick access': ['Web Player', 'Mobile App', 'Support'],
    'team': ['About', 'Contact'],
    'communities': ['Developers', 'Partners', 'Enthusiasts']
  };

  return (
    <div className='page-landing'>
      <div className='page-landing__nav side-space'>
        <div className='nav-left'>
          <div className='nav-left__logo'>
            <a href='/home'>
              <Logo />
            </a>
          </div>
          <nav className='nav-left__menu-container'>
            <ul className='nav-left__menu'>
              <li className='nav-menu__item'>
                <LinkColor label='Home' href='/home' />
              </li>
              <li className='nav-menu__item'>
                <LinkColor label='Premium' href='#' />
              </li>
              <li className='nav-menu__item'>
                <LinkColor label='About' href='#' />
              </li>
            </ul>
          </nav>
        </div>
        <div className='nav-right'>
          <a href='/register'>
            <ButtonFrame label='Register' />
          </a>
          <div className='nav-menu__item'>
            <LinkColor label='Sign in' href='/login' />
          </div>
        </div>
      </div>
      <div className='page-landing__intro'>
        <div className='intro-background'></div>
        <div className='intro-layer'></div>
        <div className='intro-body side-space'>
          <img src={landingIntro} width='300px' />
          <div className='intro-text'>
            <div className='font-banner font-white pb-4'>
              Vibe your music freedom
            </div>
            <div className='d-flex align-items-center'>
              <a href='/player'>
                <ButtonMain label='Join free' />
              </a>
              <div className='pl-4 font-tip font-gray-light'>
                No credit card requried
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='page-landing__body side-space'>
        <div className='container body-grid'>
          <div className='row pb-5'>
            <a href='#' className='col-md-3'>
              <img src={cell1} />
            </a>
            <div className='col-md-6 text-center'>
              <h4 className='pt-4 pb-4 font-white'>
                Million of songs ready to be discovered
              </h4>
              <div className='pb-4'>
                <a href='/register'>
                  <ButtonFrame label='Sign up' />
                </a>
              </div>
              <h4 className='pb-4 font-white'>Become and Artist</h4>
            </div>
            <a href='#' className='col-md-3 pb-sm-3 pb-md-0'>
              <img src={cell2} />
            </a>
          </div>
          <div className='row'>
            <a href='#' className='col-md-3 pb-sm-3 pb-md-0'>
              <img src={cell3} />
            </a>
            <a href='#' className='col-md-3 pb-sm-3 pb-md-0'>
              <img src={cell4} />
            </a>
            <a href='#' className='col-md-3 pb-sm-3 pb-md-0'>
              <img src={cell5} />
            </a>
            <a href='#' className='col-md-3 pb-sm-3 pb-md-0'>
              <img src={cell6} />
            </a>
          </div>
        </div>
      </div>
      <div className='page-landing__footer side-space'>
        <div className='container more'>
          <div className='row'>
            {Object.keys(footer).map((key, index) => (
              <div className='col-3' key={index}>
                <div className='more__header font-short-b font-gray-light'>
                  {key}
                </div>
                {footer[key].map((val, childIndex) => (
                  <div
                    className='more__item font-short-b font-white'
                    key={childIndex}
                  >
                    {val}
                  </div>
                ))}
              </div>
            ))}
            <div className='col-3'>
              <Logo />
              <div className='d-flex w-100 pt-5 justify-content-center'>
                <div className='pr-3'>
                  <Instagram />
                </div>
                <div className='pr-3'>
                  <Facebook />
                </div>
                <div className='pr-3'>
                  <Twitter />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container d-flex justify-content-between'>
          <div className='font-tip font-gray-light'>
            &#9400; 2020 Indie Vibe
          </div>
          <div className='font-tip font-gray-light'>
            <span className='pr-3'>Privacy Policy</span>
            <span className='pr-3'>Terms and Condiions</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
