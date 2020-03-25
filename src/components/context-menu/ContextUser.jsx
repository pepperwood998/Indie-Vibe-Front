import React, { useContext } from 'react';
import { AuthContext } from '../../contexts';
import { LinkWhiteColor } from '../links';

function ContextUser(props) {
  const { content } = props;

  const { state: authState } = useContext(AuthContext);

  return (
    <div className='context-menu' ref={props.elemRef}>
      {content.id === authState.id ? <Me {...props} /> : <Other {...props} />}
    </div>
  );
}

function Me(props) {
  const { content, handlers } = props;

  return (
    <ul>
      <li
        onClick={() => {
          handlers.handleClose();
        }}
      >
        <LinkWhiteColor nav={true} href={`/player/library/${content.id}`}>
          Library
        </LinkWhiteColor>
      </li>
    </ul>
  );
}

function Other(props) {
  const { content, handlers } = props;

  return (
    <ul>
      <li>
        {content.relation.includes('favorite') ? (
          <LinkWhiteColor
            onClick={() => {
              handlers.handleToggleFavorite('unfavorite');
            }}
          >
            Unfollow
          </LinkWhiteColor>
        ) : (
          <LinkWhiteColor
            onClick={() => {
              handlers.handleToggleFavorite('favorite');
            }}
          >
            Follow
          </LinkWhiteColor>
        )}
      </li>
      {content.type === 'artist' ? (
        <li>
          <LinkWhiteColor>Report Artist</LinkWhiteColor>
        </li>
      ) : (
        ''
      )}
    </ul>
  );
}

export default ContextUser;
