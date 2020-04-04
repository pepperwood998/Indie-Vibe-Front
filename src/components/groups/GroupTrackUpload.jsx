import React, { useState, useEffect, useRef } from 'react';

import { InputForm, InputFileLabel, InputGenre } from '../inputs';
import { GroupGenreDialog } from '.';

import { CloseIcon } from '../../assets/svgs';
import Tooltip from '../tooltips/Tooltip';

function GroupTrackUpload(props) {
  const [info, setInfo] = useState({});
  const [audio, setAudio] = useState({});
  const [audioSrc, setAudioSrc] = useState({});
  const [genreDialogOpened, setGenreDialogOpened] = useState(false);

  useEffect(() => {
    props.handleItemChange(trackInd, info, audio, audioSrc);
  }, [info, audio, audioSrc]);

  const ref = {
    audio128: useRef(),
    audio320: useRef()
  };

  const { genreList, index: trackInd, submitted } = props;

  const handleChange = e => {
    setInfo({
      ...info,
      [e.target.getAttribute('name')]: e.target.value
    });
  };

  const handleAudioChange = e => {
    let file = ref[e.target.getAttribute('data-ref-type')].current.files[0];
    if (file) {
      setAudio({
        ...audio,
        [e.target.getAttribute('name')]: file
      });
      setAudioSrc({
        ...audioSrc,
        [e.target.getAttribute('name')]: file.name
      });
    }
  };

  const handleOpenGenreDialog = () => {
    setGenreDialogOpened(true);
  };

  const handleGenreDialogClosed = e => {
    setGenreDialogOpened(false);
  };

  const handleGenreDialogSaved = selected => {
    setInfo({
      ...info,
      genres: [...selected]
    });
    setGenreDialogOpened(false);
  };

  return (
    <div>
      <div className='upload-track-item'>
        <div
          className='marker-wrapper'
          onClick={() => {
            props.handleItemDelete(props.index);
          }}
        >
          <Tooltip tooltip='Remove item'>
            <span className='font-short-s font-weight-bold index'>
              {props.index + 1}
            </span>
            <CloseIcon className='close svg--small' />
          </Tooltip>
        </div>
        <input
          id={'audio128' + props.index}
          type='file'
          accept='.mp3'
          name='audio128'
          ref={ref.audio128}
          onChange={handleAudioChange}
          data-ref-type='audio128'
          className='input-custom'
        />
        <input
          id={'audio320' + props.index}
          type='file'
          accept='.mp3'
          name='audio320'
          ref={ref.audio320}
          onChange={handleAudioChange}
          data-ref-type='audio320'
          className='input-custom'
        />
        <div className='upload-field'>
          <span className='label'>Title:</span>
          <InputForm
            placeholder='Enter song title'
            name='title'
            onChange={handleChange}
            value={props.info.title}
            error={submitted && props.info.title === ''}
            errMessage='Missing song name'
          />
        </div>
        <div className='upload-field'>
          <span className='label'>Genres:</span>
          <div className='genre-input-wrapper'>
            {props.info.genres.length > 0
              ? props.info.genres
                  .map(g => g.name)
                  .reduce((prev, curr) => [prev, ', ', curr])
              : ''}
            <InputGenre
              onClick={handleOpenGenreDialog}
              error={submitted && props.info.genres.length <= 0}
            />
          </div>
        </div>
        <div className='upload-field'>
          <span className='label'>MP3 128:</span>
          <InputFileLabel
            for={'audio128' + props.index}
            error={submitted && !props.audio.audio128}
            errMessage='Missing 128kbps mp3 file'
            keep={false}
          >
            {props.audioSrc.audio128
              ? props.audioSrc.audio128
              : 'Choose 128kbps file'}
          </InputFileLabel>
        </div>
        <div className='upload-field'>
          <span className='label'>MP3 320:</span>
          <InputFileLabel
            for={'audio320' + props.index}
            error={submitted && !props.audio.audio320}
            errMessage='Missing 320kbps mp3 file'
            keep={false}
          >
            {props.audioSrc.audio320
              ? props.audioSrc.audio320
              : 'Choose 320kbps file'}
          </InputFileLabel>
        </div>
        <div className='upload-field'>
          <span className='label'>Produced by:</span>
          <InputForm
            placeholder='Enter the production team'
            name='producer'
            value={props.info.producer}
            onChange={handleChange}
          />
        </div>
      </div>
      {genreDialogOpened ? (
        <GroupGenreDialog
          items={genreList}
          selected={props.info.genres}
          handleGenreDialogSaved={handleGenreDialogSaved}
          handleGenreDialogClosed={handleGenreDialogClosed}
        />
      ) : (
        ''
      )}
    </div>
  );
}

export default GroupTrackUpload;
