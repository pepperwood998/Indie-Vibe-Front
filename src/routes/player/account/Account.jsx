import React, { useContext } from 'react';
import { PremiumRoute, UserRoute } from '../../../components/custom-routes';
import { GroupEmpty } from '../../../components/groups';
import { NavigationTab } from '../../../components/navigation';
import { MeContext, AuthContext } from '../../../contexts';
import { TemplateNavPage } from '../template';
import BecomeArtist from './BecomeArtist';
import Information from './Information';
import Password from './Password';
import Settings from './Settings';
import Social from './Social';

function Account(props) {
  const { state: authState } = useContext(AuthContext);
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
        },
        {
          href: `/player/account/baa`,
          label: 'Become an Artist',
          isDisabled: authState.role === 'r-free',
          isSpecial: true,
          isGone:
            authState.role === 'r-artist' || authState.role === 'r-curator',
          disabledReason: 'Upgrade to premium to use this feature'
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
    <GroupEmpty isEmpty={!account.id} message='Account not found'>
      <TemplateNavPage nav={nav} body={body} />;
    </GroupEmpty>
  );
}

export default Account;
