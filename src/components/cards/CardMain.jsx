import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { NavLinkUnderline } from '../links';
import { ButtonIcon } from '../buttons';
import { performActionFavorite } from '../../apis/API';
import { AuthContext, StreamContext } from '../../contexts';
import { streamCollection } from '../../apis/StreamAPI';

import Placeholder from '../../assets/imgs/placeholder.png';
import {
  PlayIcon,
  UnFavoriteIcon,
  MoreIcon,
  FavoriteIcon,
  PauseIcon
} from '../../assets/svgs';

function CardMain(props) {
  const { content } = props;

  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamAction,
    dispatch: streamDispatch
  } = useContext(StreamContext);

  const [relation, setRelation] = useState([...content.relation]);

  useEffect(() => {
    props.handleToggleFavorite(content.type, props.index, relation);
  }, [relation]);

  const current = streamState.queue[streamState.currentSong];

  const handleToggleFavorite = action => {
    performActionFavorite(
      authState.token,
      content.type,
      content.id,
      relation,
      action
    )
      .then(r => {
        setRelation(r);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handlePaused = () => {
    streamDispatch(streamAction.requestPaused(true));
  };

  const handlePlay = () => {
    if (content.id === streamState.collectionId) {
      streamDispatch(streamAction.requestPaused(false));
    } else {
      streamCollection(authState.token, content.type, content.id).then(res => {
        if (res.status === 'success') {
          streamDispatch(
            streamAction.start({
              queue: res.data,
              playType: content.type,
              collectionId: content.id
            })
          );
        }
      });
    }
  };

  return (
    <div className='card-main'>
      <div className='card-main__cover-wrapper'>
        <div className='dummy'></div>
        <Link to={`/player/${content.type}/${content.id}`}>
          <img
            src={content.thumbnail ? content.thumbnail : Placeholder}
            className='cover'
          />
        </Link>
        <div className='action playlist-release'>
          <ButtonIcon>
            {content.id === streamState.collectionId && !streamState.paused ? (
              <PauseIcon onClick={handlePaused} />
            ) : (
              <PlayIcon onClick={handlePlay} />
            )}
          </ButtonIcon>
          <div className='action__extra playlist-release'>
            {relation.includes('own') ? (
              ''
            ) : relation.includes('favorite') ? (
              <ButtonIcon>
                <FavoriteIcon
                  className='svg--blue'
                  onClick={() => {
                    handleToggleFavorite('unfavorite');
                  }}
                />
              </ButtonIcon>
            ) : (
              <ButtonIcon>
                <UnFavoriteIcon
                  onClick={() => {
                    handleToggleFavorite('favorite');
                  }}
                />
              </ButtonIcon>
            )}
            <ButtonIcon>
              <MoreIcon />
            </ButtonIcon>
          </div>
        </div>
      </div>
      <div className='card-main__info'>
        <NavLinkUnderline
          href={`/player/${content.type}/${content.id}`}
          className='font-short-big font-weight-bold font-white'
        >
          {content.title}
        </NavLinkUnderline>
        <div className='content playlist-release font-short-s font-gray-light'>
          <span>
            {content.type === 'release' ? (
              <React.Fragment>
                by&nbsp
                <NavLinkUnderline
                  href={`/player/artist/${content.artist.id}`}
                  className='font-gray-light'
                >
                  {content.artist.displayName}
                </NavLinkUnderline>
              </React.Fragment>
            ) : (
              content.description
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CardMain;
