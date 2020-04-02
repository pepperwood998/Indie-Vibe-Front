import React, { useContext } from 'react';
import AvatarPlaceholder from '../../../assets/imgs/avatar-placeholder.jpg';
import { ArrowDown } from '../../../assets/svgs';
import { ContextMenuAccount } from '../../../components/context-menu';
import { MeContext } from '../../../contexts';

function TopBar(props) {
  const { state: meState } = useContext(MeContext);

  return (
    <React.Fragment>
      <section className='dropdown'>
        <div className='user-box' data-toggle='dropdown'>
          <div className='thumbnail-wrapper'>
            <img className='thumbnail' src={AvatarPlaceholder} />
          </div>
          <span className='title'>{meState.displayName}</span>
          <ArrowDown className='svg--small svg--cursor svg--gray-light' />
        </div>
        <div className='account-menu dropdown-menu'>
          <ContextMenuAccount fromLanding={true} />
        </div>
      </section>
    </React.Fragment>
  );
}

export default TopBar;
