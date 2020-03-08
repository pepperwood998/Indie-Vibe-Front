import React from 'react';
import { NavLink } from 'react-router-dom';

import { ArtistRoute } from '../../../components/custom-routes';

function Workspace() {
  return (
    <div className='artist-page'>
      <div className='tab-menu-wrapper'>
        <ul className='tab-menu'>
          <li>
            <NavLink
              to='/player/workspace/releases'
              className='link-bright-gray font-short-big font-weight-bold font-gray-light'
            >
              Your releases
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/player/workspace/statistic'
              className='link-bright-gray font-short-big font-weight-bold font-gray-light'
            >
              Statistic
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/player/workspace/upload'
              className='link-bright-gray font-short-big font-weight-bold font-gray-light'
            >
              Publish new Release
            </NavLink>
          </li>
        </ul>
      </div>
      <div className='content-wrapper'>
        <ArtistRoute
          exact
          path={['/player/workspace', '/player/workspace/releases']}
          component={Releases}
        />
        <ArtistRoute path='/player/workspace/statistic' component={Statistic} />
        <ArtistRoute path='/player/workspace/upload' component={Upload} />
      </div>
    </div>
  );
}

function Releases() {
  return <div className='workspace-releases'></div>;
}

function Statistic() {
  return <div className='workspace-statistic'></div>;
}

function Upload() {
  return <div className='workspace-upload'></div>;
}

export default Workspace;
