import React, { useContext, useEffect, useState } from 'react';
import { getArtist } from '../../../apis/API';
import { updateBiography } from '../../../apis/APIWorkspace';
import { ButtonFrame, ButtonMain } from '../../../components/buttons';
import { InputTextLimit } from '../../../components/inputs';
import { AuthContext, LibraryContext } from '../../../contexts';
import { Common, useEffectSkip } from '../../../utils/Common';

function Biography() {
  const { state: authState } = useContext(AuthContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );
  const [srcBio, setSrcBio] = useState('');
  const [biography, setBiography] = useState([false, '']);
  const [submited, setSubmitted] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [length, setLength] = useState(0);

  useEffect(() => {
    getArtist(authState.token, authState.id)
      .then(res => {
        if (res.status === 'success') {
          const bio = res.data.biography;
          setSrcBio(bio || '');
          setBiography([false, bio]);
          setLength(bio.length);
        } else throw res.data;
      })
      .catch(err => {
        setUpdating(false);
        if (typeof err !== 'string') {
          err = 'Server error';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
  }, []);

  useEffectSkip(() => {
    setLength(biography[1].length);
  }, [biography]);

  const handleBiographyChange = e => {
    const text = e.target.value;
    setBiography([true, text.substr(0, Common.BIOGRAPHY_LIMIT)]);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (biography[0] && !biography[1]) return;

    if (!biography[0]) {
      libDispatch(
        libActions.setNotification(true, true, 'Biography unchanged')
      );
      return;
    }

    setUpdating(true);
    updateBiography(authState.token, biography[1].trim())
      .then(res => {
        setUpdating(false);
        if (res.status === 'success') {
          libDispatch(
            libActions.setNotification(true, true, 'Biography updated')
          );
        } else throw res.data;
      })
      .catch(err => {
        setUpdating(false);
        if (typeof err !== 'string') {
          err = 'Server error';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
  };

  return (
    <div className='workspace-biography content-padding fadein'>
      <section>
        <p className='font-short-semi font-weight-bold font-white'>
          Self biography
        </p>
        <InputTextLimit
          placeholder='Enter your biography'
          value={biography[1]}
          onChange={handleBiographyChange}
          error={submited && biography[0] && !biography[1]}
          errMessage='You should provide biography'
          length={length}
          limit={Common.BIOGRAPHY_LIMIT}
        />
      </section>
      <section className='mt-3'>
        <ButtonMain onClick={handleSubmit} disabled={updating}>
          UPDATE
        </ButtonMain>
        <ButtonFrame
          className='ml-2'
          onClick={() => {
            setBiography([false, srcBio]);
          }}
          disabled={!biography[0]}
        >
          Cancel
        </ButtonFrame>
      </section>
    </div>
  );
}

export default Biography;
