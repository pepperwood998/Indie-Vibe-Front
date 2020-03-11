import React, { useState, useEffect, useRef } from 'react';

import { InputForm, FileLabel, InputGenre } from '../inputs';
import GenreDialog from './GenreDialog';

import { AddIcon, CloseIcon } from '../../assets/svgs';

function TrackUploadItem(props) {
  const [info, setInfo] = useState({ ...props.info });
  const [audio, setAudio] = useState({ ...props.audio });
  const [audioSrc, setAudioSrc] = useState({ ...props.audioSrc });

  const [genreDialogOpened, setGenreDialogOpened] = useState(false);

  const { genreList, index: trackInd } = props;

  useEffect(() => {
    props.handleItemChange(trackInd, info, audio, audioSrc);
  }, [info, audio, audioSrc]);

  const ref = {
    audio128: useRef(),
    audio320: useRef()
  };

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
          <span className='font-short-s font-weight-bold index'>
            {props.index + 1}
          </span>
          <CloseIcon className='close' />
        </div>
        <input
          id={'audio128' + props.index}
          type='file'
          accept='.mp3'
          name='audio128'
          ref={ref.audio128}
          onChange={handleAudioChange}
          data-ref-type='audio128'
          className='input-file'
        />
        <input
          id={'audio320' + props.index}
          type='file'
          accept='.mp3'
          name='audio320'
          ref={ref.audio320}
          onChange={handleAudioChange}
          data-ref-type='audio320'
          className='input-file'
        />
        <div className='upload-field'>
          <span className='label'>Title:</span>
          <InputForm
            placeholder='Enter song title'
            name='title'
            onChange={handleChange}
            value={props.info.title}
            error={props.info.title === '' && props.submitted}
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
              error={props.submitted && props.info.genres.length <= 0}
            />
          </div>
        </div>
        <div className='upload-field'>
          <span className='label'>MP3 128:</span>
          <FileLabel
            for={'audio128' + props.index}
            error={props.submitted && !props.audio.audio128}
            errMessage='Missing 128kbps mp3 file'
            keep={false}
          >
            {props.audioSrc.audio128
              ? props.audioSrc.audio128
              : 'Choose 128kbps file'}
          </FileLabel>
        </div>
        <div className='upload-field'>
          <span className='label'>MP3 320:</span>
          <FileLabel
            for={'audio320' + props.index}
            error={props.submitted && !props.audio.audio320}
            errMessage='Missing 320kbps mp3 file'
            keep={false}
          >
            {props.audioSrc.audio320
              ? props.audioSrc.audio320
              : 'Choose 320kbps file'}
          </FileLabel>
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
        <GenreDialog
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

export default TrackUploadItem;
