import React, { useContext, useEffect, useState } from 'react';
import { getAccount } from '../../../apis/API';
import { UserRoute } from '../../../components/custom-routes';
import { NavigationTab } from '../../../components/navigation';
import { AuthContext } from '../../../contexts';
import { TemplateNavPage } from '../template';
import Information from './Information';
import Password from './Password';
import Settings from './Settings';
import Social from './Social';
import { GroupEmpty } from '../../../components/groups';

function Account(props) {
  const { state: authState } = useContext(AuthContext);

  const [status, setStatus] = useState({
    firstRender: true,
    existed: false
  });
  const [account, setAccount] = useState({
    fbId: '',
    displayName: '',
    email: '',
    gender: 0,
    dob: '',
    artistStatus: '',
    role: {}
  });

  useEffect(() => {
    getAccount(authState.token)
      .then(res => {
        setStatus({ ...status, firstRender: false });
        if (res.status === 'success') {
        setStatus({ ...status, existed: true });
        setAccount({ ...account, ...res.data });
        } else {
          throw 'Error';
        }
      })
      .catch();
  }, []);

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

  return status.firstRender ? (
    ''
  ) : (
    <GroupEmpty isEmpty={!status.existed} message='Account not found'>
      <TemplateNavPage nav={nav} body={body} />;
    </GroupEmpty>
  );
}

export default Account;
