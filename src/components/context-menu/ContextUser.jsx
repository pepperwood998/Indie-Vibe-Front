import React, { useContext } from 'react';
import { AuthContext } from '../../contexts';
import { LinkWhiteColor } from '../links';


function ContextUser(props) {
  const { content } = props;

  const { state: authState } = useContext(AuthContext);

  if (content.id === authState.id) {
    return <Me {...props} />;
  } else {
    return <Other {...props} />;
  }
}

function Me(props) {
  const { content } = props;

  return (
    <div className='context-menu'>
      <ul>
        <li>
          <LinkWhiteColor>Library</LinkWhiteColor>
        </li>
      </ul>
    </div>
  );
}

function Other(props) {
  const { content, handlers } = props;

  return (
    <div className='context-menu'>
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
    </div>
  );
}

export default ContextUser;
