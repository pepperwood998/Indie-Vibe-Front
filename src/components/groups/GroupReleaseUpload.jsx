import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  getAccount,
  getGenresList,
  getReleaseTypeList,
  publishRelease
} from '../../apis/API';
import Placeholder from '../../assets/imgs/placeholder.png';
import { AuthContext, LibraryContext, MeContext } from '../../contexts';
import { ButtonFrame, ButtonMain } from '../buttons';
import { CardError, CardSuccess } from '../cards';
import { GroupTrackUpload } from '../groups';
import { InputFileLabel, InputForm, InputTextarea } from '../inputs';

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
function GroupReleaseUpload(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: meState,
    actions: meActions,
    dispatch: meDispatch
  } = useContext(MeContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const [biography, setBiography] = useState('');
  const [release, setRelease] = useState({ title: '', typeId: 're-album' });
  const [info, setInfo] = useState([Object.assign({}, infoModel)]);
  const [thumbnail, setThumbnail] = useState(null);
  const [audio, setAudio] = useState([Object.assign({}, audioModel)]);

  const [thumbnailSrc, setThumbnailSrc] = useState('');
  const [audioSrc, setAudioSrc] = useState([Object.assign({}, audioModel)]);
  const [submitted, setSubmitted] = useState(false);
  const [publishing, setPublishing] = useState(0);
  const [success, setSuccess] = useState(false);

  const releaseTypes = [...libState.releaseTypes];

  const thumbnailRef = useRef();

  useEffect(() => {
    let successTimeout;
    let failTimeout;
    if (publishing === 2) {
      if (success) {
        if (props.baa) {
          getAccount(authState.token).then(res => {
            if (res.status === 'success') {
              meDispatch(meActions.loadMe(res.data));
            }
          });
        } else {
          successTimeout = setTimeout(() => {
            window.location.href = '/player/workspace';
          }, 1000);
        }
      } else {
        failTimeout = setTimeout(() => {
          setPublishing(0);
        }, 1000);
      }
    }

    return () => {
      clearTimeout(successTimeout);
      clearTimeout(failTimeout);
    };
  }, [publishing]);

  const handleBiographyChange = e => {
    setBiography(e.target.value);
  };

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

    libDispatch(
      libActions.setConfirmDialog(
        true,
        'Confirm publishing this release?',
        () => {
          let resInfo = { ...release };
          let tracks = info.map(track => ({
            title: track.title,
            producer: track.producer,
            genres: track.genres.map(g => g.id)
          }));
          resInfo = { ...resInfo, tracks };

          setPublishing(1);
          publishRelease(
            authState.token,
            resInfo,
            thumbnail,
            audio,
            biography,
            props.baa
          )
            .then(response => response.json())
            .then(res => {
              if (res.status === 'success') {
                setSuccess(true);
              }
              setPublishing(2);
            });
        }
      )
    );
  };

  if (props.baa && meState.artistStatus === 'pending')
    return (
      <div className='upload-pending'>
        <p className='font-short-semi font-weight-bold font-white'>
          Artist Pending
        </p>
        <p className='font-short-regular font-white'>
          Your request to become an Artist is being processed, your first
          release is currently public for browsing.
        </p>
      </div>
    );

  return (
    <div className='upload-main'>
      {props.baa ? (
        <div className='biography-wrapper pb-4'>
          <p className='font-short-semi font-weight-bold font-white'>
            Self biography
          </p>
          <InputTextarea
            placeholder='Enter your biography'
            value={biography}
            onChange={handleBiographyChange}
          />
        </div>
      ) : (
        ''
      )}
      <section className='release-wrapper'>
        <p className='font-short-semi font-weight-bold font-white'>
          {props.baa ? 'Your first release' : 'Publish your release'}
        </p>
        <div className='release-upload'>
          {publishing ? (
            <div className='upload-layer'>
              <span className='font-short-extra font-weight-bold font-white'>
                {publishing === 1 ? (
                  'Pulbishing...'
                ) : success ? (
                  <CardSuccess message='Your release has been published' />
                ) : (
                  <CardError message='Failed to publish' />
                )}
              </span>
            </div>
          ) : (
            ''
          )}
          <div className='upload-cover'>
            <InputFileLabel
              for='thumbnail'
              error={submitted && !thumbnail}
              keep={true}
              className='input-custom__label--img'
            >
              <div className='cover-wrapper'>
                <input
                  ref={thumbnailRef}
                  type='file'
                  name='thumbnail'
                  id='thumbnail'
                  className='input-custom'
                  onChange={handleThumbnailChange}
                  accept='image/*'
                />
                <img
                  className='img'
                  src={thumbnailSrc ? thumbnailSrc : Placeholder}
                />
              </div>
            </InputFileLabel>
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
                {releaseTypes.map((releaseType, index) => (
                  <option value={releaseType.id} key={index}>
                    {releaseType.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='upload-body'>
              {info.map((track, index) => (
                <div className='upload-item' key={index}>
                  <GroupTrackUpload
                    index={index}
                    handleItemChange={handleItemChange}
                    handleItemDelete={handleItemDelete}
                    info={info[index]}
                    audio={audio[index]}
                    audioSrc={audioSrc[index]}
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
      </section>
    </div>
  );
}

export default GroupReleaseUpload;
