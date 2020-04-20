import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { RouteAuthorized } from '../../components/custom-routes';
import {} from '../../components/groups';
import { ROUTES } from '../../config/RoleRouting';
import { LibraryContext } from '../../contexts';
import { Notification } from '../player/Player';
import { NavMenu, TopBar } from './layout';
import {
  Dashboard,
  DelegateCurator,
  Reports,
  RequestDetails,
  Requests,
  Revenue,
  StreamingStatistics
} from './monopage';

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
          <RouteAuthorized
            exact
            component={Dashboard}
            path={ROUTES.cms.dashboard[0]}
            roleGroup={ROUTES.cms.dashboard[1]}
          />
          <RouteAuthorized
            component={Requests}
            path={ROUTES.cms.requests[0]}
            roleGroup={ROUTES.cms.requests[1]}
          />
          <RouteAuthorized
            component={RequestDetails}
            path={ROUTES.cms.requestDetails[0]}
            roleGroup={ROUTES.cms.requestDetails[1]}
          />
          <RouteAuthorized
            component={DelegateCurator}
            path={ROUTES.cms.delegateCurator[0]}
            roleGroup={ROUTES.cms.delegateCurator[1]}
          />
          <RouteAuthorized
            component={Reports}
            path={ROUTES.cms.reports[0]}
            roleGroup={ROUTES.cms.reports[1]}
          />
          <RouteAuthorized
            component={StreamingStatistics}
            path={ROUTES.cms.streaming[0]}
            roleGroup={ROUTES.cms.streaming[1]}
          />
          <RouteAuthorized
            component={Revenue}
            path={ROUTES.cms.revenue[0]}
            roleGroup={ROUTES.cms.revenue[1]}
          />
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
