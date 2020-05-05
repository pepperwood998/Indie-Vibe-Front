import React, { useContext, useEffect, useState } from 'react';
import { getArtist } from '../../../apis/API';
import { updateBiography } from '../../../apis/APIWorkspace';
import { ButtonFrame, ButtonMain } from '../../../components/buttons';
import { InputTextarea } from '../../../components/inputs';
import { AuthContext, LibraryContext } from '../../../contexts';

function Biography() {
  const { state: authState } = useContext(AuthContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );
  const [srcBio, setSrcBio] = useState('');
  const [biography, setBiography] = useState([false, '']);
  const [submited, setSubmitted] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getArtist(authState.token, authState.id)
      .then(res => {
        if (res.status === 'success') {
          setSrcBio(res.data.biography || '');
          setBiography([false, res.data.biography]);
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

  const handleBiographyChange = e => {
    setBiography([true, e.target.value]);
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
        <InputTextarea
          placeholder='Enter your biography'
          value={biography[1]}
          onChange={handleBiographyChange}
          error={submited && biography[0] && !biography[1]}
          errMessage='You should provide biography'
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
