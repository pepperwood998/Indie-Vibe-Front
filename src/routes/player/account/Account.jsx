import React, { useEffect, useState } from 'react';
import { UserRoute } from '../../../components/custom-routes';
import { NavigationTab } from '../../../components/navigation';
import { TemplateNavPage } from '../template';
import Information from './Information';
import Password from './Password';
import Settings from './Settings';
import Social from './Social';

function Account(props) {
  const [account, setAccount] = useState({
    displayName: 'Tuan',
    email: 'tuandt66742@gmail.com',
    gender: 0,
    dob: '2000-10-10'
  });

  useEffect(() => {}, []);

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
      <UserRoute
        exact
        path='/player/account'
        component={Information}
        account={account}
      />
      <UserRoute path='/player/account/password' component={Password} />
      <UserRoute path='/player/account/social' component={Social} />
      <UserRoute path='/player/account/settings' component={Settings} />
    </React.Fragment>
  );

  return <TemplateNavPage nav={nav} body={body} />;
}

export default Account;
