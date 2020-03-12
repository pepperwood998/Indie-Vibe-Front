import React from 'react';

import { FileLabel } from '../inputs';
import { ButtonMain } from '../buttons';

import PlaylistPlaceholder from '../../assets/imgs/playlist-placeholder.png';

function GroupPlaylistDialog(props) {
  return (
    <div className='playlist-dialog-wrapper'>
      <div className='playlist-dialog'>
        <div className='playlist-dialog__header font-short-big font-weight-bold font-white'>
          Create Playlist
        </div>
        <div className='playlist-dialog__body'>
          <div className='left'>
            <div className='left__playlist-title-input'>
              <input
                type='text'
                placeholder='Playlist name'
                className='input-text input-text__full'
              />
            </div>
            <div className='left__playlist-desc-input'>
              <textarea
                className='input-text input-text__full'
                placeholder='Description for this playlist (optional)'
              ></textarea>
            </div>
          </div>
          <div className='right'>
            <div className='right__cover'>
              <input
                type='file'
                name='playlistCover'
                id='playlist-cover'
                className='input-custom'
                accept='image/*'
              />
              <FileLabel
                for='playlist-cover'
                keep={true}
                className='input-label--img'
              >
                <img src={PlaylistPlaceholder} />
              </FileLabel>
            </div>
            <div className='right__button'>
              <ButtonMain>Create</ButtonMain>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupPlaylistDialog;
