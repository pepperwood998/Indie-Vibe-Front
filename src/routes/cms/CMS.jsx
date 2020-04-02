import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CMSRoute } from '../../components/custom-routes';
import { NavMenu, TopBar } from './layout';
import { Home, RequestDetails, Requests } from './monopage';
import CreateCurator from './monopage/PageCreateCurator';

function CMS(props) {
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
          <CMSRoute path='/cms/create-curator' component={CreateCurator} />
          <Route path='*'>
            <Redirect to='/404' />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default CMS;
