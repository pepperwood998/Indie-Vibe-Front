import React, { useState, useRef, useContext } from 'react';

import { AuthContext, LibraryContext } from '../../contexts';
import {
  createPlaylist,
  getPlaylistSimple,
  createOrEditPlaylist
} from '../../apis/API';
import { InputFileLabel, InputText } from '../inputs';
import { ButtonMain } from '../buttons';

import { CloseIcon } from '../../assets/svgs';
import Placeholder from '../../assets/imgs/placeholder.png';

function GroupPlaylistDialog(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const thumbnailRef = useRef();

  const { editPlaylist } = libState;
  const { playlist } = editPlaylist;
  const isEdit = editPlaylist.type === 'edit';

  const [data, setData] = useState({
    title: [false, playlist.title],
    description: [false, playlist.description ? playlist.description : ''],
    thumbnail: [false, null]
  });
  const [thumbnailSrc, setThumbnailSrc] = useState(playlist.thumbnail);
  const [submitted, setSubmitted] = useState(0);

  const handlePropagateDialog = e => {
    e.stopPropagation();
  };

  const handleCloseDialog = () => {
    libDispatch(libActions.setEditPlaylist(false));
  };

  const handleCreateOrEditPlaylistSuccess = playlistId => {
    getPlaylistSimple(authState.token, playlistId).then(res => {
      if (res.status === 'success') {
        if (isEdit) {
          libDispatch(libActions.setEditedPlaylist(res.data));
        } else {
          props.history.push(`/player/playlist/${res.data.id}`);
          libDispatch(libActions.createPlaylist(res.data));
        }
      }
    });
  };

  const handleChangeInfo = e => {
    setData({
      ...data,
      [e.target.getAttribute('name')]: [true, e.target.value]
    });
  };

  const handleChangeThumbnail = () => {
    let file = thumbnailRef.current.files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = e => {
        setData({ ...data, thumbnail: [true, file] });
        setThumbnailSrc(reader.result);
      };
    }
  };

  const handleSubmit = () => {
    setSubmitted(1);
    if (!data.title[1]) return;

    setSubmitted(2);
    createOrEditPlaylist(authState.token, data, editPlaylist.type, playlist.id)
      .then(res => {
        if (res.status === 'success') {
          handleCreateOrEditPlaylistSuccess(isEdit ? playlist.id : res.data);

          handleCloseDialog();
          libDispatch(
            libActions.setNotification(
              true,
              true,
              isEdit ? 'Playlist edited' : 'Playlist created'
            )
          );
        } else {
          throw 'Error';
        }
      })
      .catch(error => {
        libDispatch(
          libActions.setNotification(
            true,
            false,
            `Failed to ${editPlaylist.type} playlist`
          )
        );
        setSubmitted(0);
      });
  };

  return (
    <div
      className='screen-overlay playlist-dialog fadein'
      onClick={handleCloseDialog}
    >
      <div className='playlist-dialog' onClick={handlePropagateDialog}>
        <CloseIcon
          className='close svg--regular svg--cursor svg--scale'
          onClick={handleCloseDialog}
        />
        <div className='playlist-dialog__header font-short-big font-weight-bold font-white'>
          {isEdit ? 'Edit Playlist' : 'Create playlist'}
        </div>
        <div className='playlist-dialog__body'>
          <div className='left'>
            <div className='left__playlist-title-input'>
              <InputText
                type='text'
                name='title'
                value={data.title[1]}
                placeholder='Playlist name'
                onChange={handleChangeInfo}
                error={submitted && !data.title[1]}
                errMessage='Must have a title'
              />
            </div>
            <div className='left__playlist-desc-input'>
              <textarea
                name='description'
                className='input-text input-text--full'
                placeholder='Description for this playlist (optional)'
                onChange={handleChangeInfo}
                value={data.description[1]}
              />
            </div>
          </div>
          <div className='right'>
            <div className='right__cover'>
              <input
                type='file'
                ref={thumbnailRef}
                name='playlistCover'
                id='playlist-cover'
                className='input-custom'
                accept='image/*'
                onChange={handleChangeThumbnail}
              />
              <InputFileLabel
                for='playlist-cover'
                keep={true}
                className='input-label--img'
              >
                <img src={thumbnailSrc ? thumbnailSrc : Placeholder} />
              </InputFileLabel>
            </div>
            <div className='right__button'>
              <ButtonMain
                onClick={handleSubmit}
                disabled={submitted === 2 ? true : false}
              >
                {isEdit ? 'Save' : 'Create'}
                {submitted === 2 ? '...' : ''}
              </ButtonMain>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupPlaylistDialog;
