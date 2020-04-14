import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogoIcon } from '../../../assets/svgs';

function NavMenu(props) {
  return (
    <React.Fragment>
      <section className='banner'>
        <LogoIcon className='icon' />
        <span className='title font-short-big font-weight-bold font-white'>
          IVB CMS
        </span>
      </section>
      <section className='menu'>
        <ul>
          <li>
            <NavLink
              className='link'
              to='/cms/dashboard'
              isActive={(match, location) => {
                const { pathname } = location;
                return pathname === '/cms' || pathname === '/cms/dashboard';
              }}
            >
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              className='link'
              to='/cms/requests'
              isActive={(match, location) => {
                const { pathname } = location;
                return (
                  pathname === '/cms/requests' ||
                  pathname.includes('/cms/request')
                );
              }}
            >
              <span>Artist requests</span>
            </NavLink>
          </li>
          <li>
            <NavLink className='link' to='/cms/delegate-curator'>
              <span className='ellipsis one-line'>Delegate curator</span>
            </NavLink>
          </li>
          <li>
            <NavLink className='link' to='/cms/reports'>
              <span className='ellipsis one-line'>Report requests</span>
            </NavLink>
          </li>
          <li>
            <NavLink className='link' to='/cms/streaming'>
              <span className='ellipsis one-line'>Streaming statistics</span>
            </NavLink>
          </li>
          <li>
            <NavLink className='link' to='/cms/revenue'>
              <span className='ellipsis one-line'>Revenue</span>
            </NavLink>
          </li>
        </ul>
      </section>
    </React.Fragment>
  );
}

export default NavMenu;
