import React, { useState, useRef } from 'react';

import { FileLabel, InputText } from '../inputs';
import { ButtonMain } from '../buttons';

import { CloseIcon } from '../../assets/svgs';
import PlaylistPlaceholder from '../../assets/imgs/playlist-placeholder.png';

function GroupPlaylistDialog(props) {
  const { isUpdated, handleCloseDialog } = props;

  const [info, setInfo] = useState({
    title: props.title,
    description: props.description
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailSrc, setThumbnailSrc] = useState(props.thumbnail);
  const [submitted, setSubmitted] = useState(false);

  const thumbnailRef = useRef();

  const handleChangeThumbnail = () => {
    let file = thumbnailRef.current.files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = e => {
        setThumbnail(file);
        setThumbnailSrc(reader.result);
      };
    }
  };

  const handleChangeInfo = e => {
    setInfo({
      ...info,
      [e.target.getAttribute('name')]: e.target.value
    });
  };

  const handlePropagateDialog = e => {
    e.stopPropagation();
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className='playlist-dialog-wrapper' onClick={handleCloseDialog}>
      <div className='playlist-dialog' onClick={handlePropagateDialog}>
        <CloseIcon
          className='svg--regular svg--cursor svg--scale'
          onClick={handleCloseDialog}
        />
        <div className='playlist-dialog__header font-short-big font-weight-bold font-white'>
          Create Playlist
        </div>
        <div className='playlist-dialog__body'>
          <div className='left'>
            <div className='left__playlist-title-input'>
              <InputText
                type='text'
                name='title'
                value={info.title}
                placeholder='Playlist name'
                onChange={handleChangeInfo}
                error={submitted && !info.title}
                errMessage='Must have a title'
              />
            </div>
            <div className='left__playlist-desc-input'>
              <textarea
                name='description'
                className='input-text input-text--full'
                placeholder='Description for this playlist (optional)'
                onChange={handleChangeInfo}
              >
                {info.description}
              </textarea>
            </div>
          </div>
          <div className='right'>
            <div className='right__cover'>
              <input
                type='file'
                ref={thumbnailRef}
                name='playlistCover'
                id='playlist-cover'
                className='input-file'
                accept='image/*'
                onChange={handleChangeThumbnail}
              />
              <FileLabel
                for='playlist-cover'
                keep={true}
                className='input-label--img'
              >
                <img src={thumbnailSrc ? thumbnailSrc : PlaylistPlaceholder} />
              </FileLabel>
            </div>
            <div className='right__button'>
              <ButtonMain onClick={handleSubmit}>
                {isUpdated ? 'Save' : 'Create'}
              </ButtonMain>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupPlaylistDialog;
