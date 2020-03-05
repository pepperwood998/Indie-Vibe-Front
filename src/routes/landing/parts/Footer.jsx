import React from 'react';

import { Logo, Facebook, Instagram, Twitter } from '../../../assets/svgs';

function Footer(props) {
  const footer = {
    'quick access': ['Web Player', 'Mobile App', 'Support'],
    'team': ['About', 'Contact'],
    'communities': ['Developers', 'Partners', 'Enthusiasts']
  };

  return (
    <div className='content'>
      <div className='container more'>
        <div className='row'>
          {Object.keys(footer).map((key, index) => (
            <div className='col-3' key={index}>
              <div className='more__header font-regular font-gray-light'>
                {key}
              </div>
              {footer[key].map((val, childIndex) => (
                <div
                  className='more__item font-regular font-white'
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
        <div className='font-tip font-gray-light'>&#9400; 2020 Indie Vibe</div>
        <div className='font-tip font-gray-light'>
          <span className='pr-3'>Privacy Policy</span>
          <span className='pr-3'>Terms and Condiions</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
