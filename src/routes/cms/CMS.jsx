import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CMSRoute } from '../../components/custom-routes';
import {} from '../../components/groups';
import { LibraryContext } from '../../contexts';
import { Notification } from '../player/Player';
import { NavMenu, TopBar } from './layout';
import { Home, RequestDetails, Requests, DelegateCurator } from './monopage';

function CMS(props) {
  const { state: libState } = useContext(LibraryContext);

  return (
    <div className='cms'>
      <div className='cms__nav-menu'>
        <NavMenu />
      </div>
      <div className='cms__top-bar'>
        <TopBar />
      </div>
      <div className='cms__body'>
        <Switch>
          <CMSRoute exact path={['/cms/', '/cms/home']} component={Home} />
          <CMSRoute path='/cms/requests' component={Requests} />
          <CMSRoute path='/cms/request/:id' component={RequestDetails} />
          <CMSRoute path='/cms/delegate-curator' component={DelegateCurator} />
          <Route path='*'>
            <Redirect to='/404' />
          </Route>
        </Switch>
      </div>
      {libState.notification.opened ? <Notification /> : ''}
    </div>
  );
}

export default CMS;
