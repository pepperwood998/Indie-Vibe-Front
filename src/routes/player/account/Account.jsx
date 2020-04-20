import React, { useContext } from 'react';
import { RouteAuthorized } from '../../../components/custom-routes';
import { GroupEmpty } from '../../../components/groups';
import { NavigationTab } from '../../../components/navigation';
import { ROUTES } from '../../../config/RoleRouting';
import { MeContext } from '../../../contexts';
import { TemplateNavPage } from '../template';
import BecomeArtist from './BecomeArtist';
import Information from './Information';
import Password from './Password';
import Settings from './Settings';

function Account(props) {
  const { state: meState } = useContext(MeContext);

  const role = meState.role.id;

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
          href: `/player/account/settings`,
          label: 'Settings'
        },
        {
          href: `/player/account/baa`,
          label: 'Become an Artist',
          isDisabled: role === 'r-free',
          isSpecial: true,
          isGone:
            role === 'r-artist' || role === 'r-curator' || role === 'r-admin',
          disabledReason: 'Upgrade to premium'
        }
      ]}
    />
  );

  const { account } = ROUTES.player;

  const body = (
    <React.Fragment>
      <RouteAuthorized
        exact
        component={Information}
        path={account.info[0]}
        roleGroup={account.info[1]}
      />
      <RouteAuthorized
        exact
        component={Password}
        path={account.password[0]}
        roleGroup={account.password[1]}
      />
      <RouteAuthorized
        exact
        component={Settings}
        path={account.settings[0]}
        roleGroup={account.settings[1]}
      />
      <RouteAuthorized
        exact
        component={BecomeArtist}
        path={account.baa[0]}
        roleGroup={account.baa[1]}
      />
    </React.Fragment>
  );

  return (
    <GroupEmpty isEmpty={!meState.id} message='Account not found'>
      <TemplateNavPage nav={nav} body={body} />;
    </GroupEmpty>
  );
}

export default Account;
