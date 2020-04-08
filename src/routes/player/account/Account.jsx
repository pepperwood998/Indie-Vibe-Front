import React, { useContext } from 'react';
import { PremiumRoute, UserRoute } from '../../../components/custom-routes';
import { GroupEmpty } from '../../../components/groups';
import { NavigationTab } from '../../../components/navigation';
import { MeContext } from '../../../contexts';
import { TemplateNavPage } from '../template';
import BecomeArtist from './BecomeArtist';
import Information from './Information';
import Password from './Password';
import Settings from './Settings';
import Social from './Social';

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

  const body = (
    <React.Fragment>
      <UserRoute exact path='/player/account' component={Information} />
      <UserRoute path='/player/account/password' component={Password} />
      <UserRoute path='/player/account/social' component={Social} />
      <UserRoute path='/player/account/settings' component={Settings} />
      <PremiumRoute path='/player/account/baa' component={BecomeArtist} />
    </React.Fragment>
  );

  return (
    <GroupEmpty isEmpty={!meState.id} message='Account not found'>
      <TemplateNavPage nav={nav} body={body} />;
    </GroupEmpty>
  );
}

export default Account;
