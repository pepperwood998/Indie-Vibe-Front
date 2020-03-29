import React, { useContext, useEffect, useState } from 'react';
import { getAccount } from '../../../apis/API';
import { UserRoute } from '../../../components/custom-routes';
import { NavigationTab } from '../../../components/navigation';
import { AuthContext, MeContext } from '../../../contexts';
import { TemplateNavPage } from '../template';
import Information from './Information';
import Password from './Password';
import Settings from './Settings';
import Social from './Social';
import { GroupEmpty } from '../../../components/groups';

function Account(props) {
  const { state: meState } = useContext(MeContext);

  const account = meState;

  const nav = (
    <NavigationTab
      items={[
        {
          href: `/player/account`,
          label: 'Information'
        },
        {
          href: `/player/account/password`,
          label: 'Update password'
        },
        {
          href: `/player/account/social`,
          label: 'Social'
        },
        {
          href: `/player/account/settings`,
          label: 'Settings'
        }
      ]}
    />
  );

  const body = (
    <React.Fragment>
      <UserRoute exact path='/player/account' component={Information} />
      <UserRoute path='/player/account/password' component={Password} />
      <UserRoute path='/player/account/social' component={Social} />
      <UserRoute path='/player/account/settings' component={Settings} />
    </React.Fragment>
  );

  return (
    <GroupEmpty isEmpty={!account.id} message='Account not found'>
      <TemplateNavPage nav={nav} body={body} />;
    </GroupEmpty>
  );
}

export default Account;
