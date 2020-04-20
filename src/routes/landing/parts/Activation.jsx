import React, { useState } from 'react';
import { resetActivationLink } from '../../../apis/API';
import Loading from '../../../assets/imgs/loading.gif';

function Activation({ activated = false, tryLogin = false, email = '' }) {
  const [reseted, setReseted] = useState(false);
  const [reseting, setReseting] = useState(false);
  const [resetFailed, setResetFailed] = useState(false);

  const handleResent = () => {
    setReseting(true);
    setResetFailed(false);

    resetActivationLink(email)
      .then(res => {
        if (res.status === 'success') {
          setReseting(false);
          setReseted(true);
        } else throw res.data;
      })
      .catch(err => {
        setReseting(false);
        setResetFailed(true);
      });
  };

  if (activated) {
    return (
      <div>
        <span>Your account has been activated successfully.</span>
      </div>
    );
  }

  return !reseting ? (
    <div className='fadein'>
      <div className='pb-2'>
        {resetFailed ? (
          <span className='font-black'>Failed to send activation link.</span>
        ) : !reseted ? (
          tryLogin ? (
            <span>Need to activate your account before use.</span>
          ) : (
            <span>An activation link has been sent to your email.</span>
          )
        ) : (
          <span>Check email for new activation link.</span>
        )}
      </div>
      <div>
        <span
          className='link underline link-underline font-gray-light'
          onClick={handleResent}
        >
          Re-send activation link
        </span>
      </div>
    </div>
  ) : (
    <div className='d-flex flex-column align-items-center'>
      <div className='pb-2'>
        <span>Resending activation link.</span>
      </div>
      <img src={Loading} width='25px' height='25px' />
    </div>
  );
}

export default Activation;
