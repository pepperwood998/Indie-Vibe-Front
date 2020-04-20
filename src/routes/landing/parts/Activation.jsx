import React, { useState } from 'react';
import { resetActivationLink } from '../../../apis/AuthAPI';
import Loading from '../../../assets/imgs/loading.gif';

function Activation({
  activated = false,
  activateFail = false,
  tryLogin = false,
  email = '',
  onResent = success => undefined
}) {
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
          onResent(true);
        } else throw res.data;
      })
      .catch(err => {
        setReseting(false);
        setResetFailed(true);
        onResent(false);
      });
  };

  if (activated) {
    return (
      <div className='fadein'>
        <p>Your account has been successfully activated.</p>
        <a href='/login' className='link link-underline underline font-white'>
          Sign in
        </a>
      </div>
    );
  }

  return !reseting ? (
    <div className='fadein'>
      <div className='pb-2'>
        {resetFailed ? (
          <span className='font-black'>Failed to send activation link.</span>
        ) : !reseted ? (
          activateFail ? (
            <span>The activation link has expired, please try a new one.</span>
          ) : tryLogin ? (
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
