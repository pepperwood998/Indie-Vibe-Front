import React, { useState, useEffect, useRef, useContext } from 'react';

import TrackUploadItem from '../../../components/groups/TrackUploadItem';
import { InputForm, FileLabel } from '../../../components/inputs';
import { ButtonMain, ButtonFrame } from '../../../components/buttons';
import {
  getGenresList,
  publishRelease,
  getReleaseTypeList
} from '../../../apis/API';
import { AuthContext } from '../../../contexts';

import Placeholder from '../../../assets/imgs/placeholder.png';

const infoModel = {
  title: '',
  genres: [],
  producer: ''
};
const audioModel = {
  audio128: null,
  audio320: null
};
const missingSomething = (info, audio) => {
  return (
    info.some(track => track.title === '' || track.genres.length === 0) ||
    audio.some(a => !a.audio128 || !a.audio320)
  );
};
function Upload() {
  const { state: authState } = useContext(AuthContext);

  const [release, setRelease] = useState({ title: '', typeId: 'r-album' });
  const [info, setInfo] = useState([Object.assign({}, infoModel)]);
  const [thumbnail, setThumbnail] = useState(null);
  const [audio, setAudio] = useState([Object.assign({}, audioModel)]);

  const [thumbnailSrc, setThumbnailSrc] = useState('');
  const [audioSrc, setAudioSrc] = useState([Object.assign({}, audioModel)]);
  const [releaseTypeList, setReleaseTypeList] = useState([]);
  const [genreList, setGenreList] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getGenresList(authState.token)
      .then(response => response.json())
      .then(res => {
        if (res.status === 'success') {
          setGenreList(res.data);
        }
      });

    getReleaseTypeList(authState.token)
      .then(response => response.json())
      .then(res => {
        if (res.status === 'success') {
          setReleaseTypeList(res.data);
        }
      });
  }, []);

  const thumbnailRef = useRef();

  const handleThumbnailChange = () => {
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

  const handleReleaseChange = e => {
    setRelease({
      ...release,
      [e.target.getAttribute('name')]: e.target.value
    });
  };

  const handleItemChange = (index, newInfo, newAudio, newAudioSrc) => {
    setInfo(
      info.map((item, i) => {
        if (index === i) {
          return {
            ...item,
            ...newInfo
          };
        }

        return item;
      })
    );
    setAudio(
      audio.map((item, i) => {
        if (index === i) {
          return {
            ...item,
            ...newAudio
          };
        }

        return item;
      })
    );
    setAudioSrc(
      audioSrc.map((item, i) => {
        if (index === i) {
          return {
            ...item,
            ...newAudioSrc
          };
        }

        return item;
      })
    );
  };

  const handleItemDelete = index => {
    setInfo(info.filter((item, i) => index !== i));
    setAudio(audio.filter((item, i) => index !== i));
    setAudioSrc(audioSrc.filter((item, i) => index !== i));
  };

  const handleAddSong = () => {
    setInfo([...info, { ...infoModel }]);
    setAudio([...audio, { ...audioModel }]);
    setAudioSrc([...audioSrc, { ...audioModel }]);
  };

  const handlePublish = () => {
    setSubmitted(false);
    if (!release.title || !thumbnail || missingSomething(info, audio)) {
      console.log('missing');
      setSubmitted(true);
      return;
    }

    let resInfo = { ...release };
    let tracks = info.map(track => ({
      title: track.title,
      producer: track.producer,
      genres: track.genres.map(g => g.id)
    }));
    resInfo = { ...resInfo, tracks };

    publishRelease(authState.token, resInfo, thumbnail, audio);
  };

  return (
    <div className='workspace-upload body__bound'>
      <div className='release-upload'>
        <div className='upload-cover-wrapper'>
          <input
            ref={thumbnailRef}
            type='file'
            name='thumbnail'
            id='thumbnail'
            className='input-custom'
            onChange={handleThumbnailChange}
            accept='image/*'
          />
          <FileLabel
            for='thumbnail'
            error={submitted && !thumbnail}
            keep={true}
            className='input-label--img'
          >
            <img src={thumbnailSrc ? thumbnailSrc : Placeholder} />
          </FileLabel>
        </div>
        <div className='upload-content'>
          <div className='upload-item upload-header'>
            <InputForm
              placeholder='Enter release title'
              onChange={handleReleaseChange}
              name='title'
              value={release.title}
              error={submitted && !release.title}
              errMessage='Missing release title'
            />
            <select
              name='typeId'
              className='custom-select release-type'
              onChange={handleReleaseChange}
            >
              {releaseTypeList.map((releaseType, index) => (
                <option value={releaseType.id} key={index}>
                  {releaseType.name}
                </option>
              ))}
            </select>
          </div>
          <div className='upload-body'>
            {info.map((track, index) => (
              <div className='upload-item' key={index}>
                <TrackUploadItem
                  index={index}
                  handleItemChange={handleItemChange}
                  handleItemDelete={handleItemDelete}
                  info={info[index]}
                  audio={audio[index]}
                  audioSrc={audioSrc[index]}
                  genreList={genreList}
                  submitted={submitted}
                />
              </div>
            ))}

            <ButtonMain onClick={handleAddSong}>ADD SONG</ButtonMain>
          </div>
        </div>
        <div>
          <ButtonFrame onClick={handlePublish}>Publish</ButtonFrame>
        </div>
      </div>
    </div>
  );
}

export default Upload;
