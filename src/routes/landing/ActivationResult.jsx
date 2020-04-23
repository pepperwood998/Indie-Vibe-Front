import React, { useEffect, useState } from 'react';
import { activate, resetActivationLink } from '../../apis/AuthAPI';
import Loading from '../../assets/imgs/loading.gif';
import { ButtonFrame, ButtonMain } from '../../components/buttons';
import { CardError, CardSuccess } from '../../components/cards';
import { InputText } from '../../components/inputs';
import Landing from './Landing';

function ActivationResult({ match, location }) {
  const [firstRender, setFirstRender] = useState(true);
  const [request, setRequest] = useState(false);
  const [status, setStatus] = useState({
    submitted: false,
    resent: false,
    resending: false,
    resendSuccess: false,
    activated: false,
    request: false
  });
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const activateToken = searchParams.get('activateToken');

  const handleChangeData = e => {
    const target = e.target;
    setData({ ...data, [target.getAttribute('name')]: target.value });
  };

  const handleResend = e => {
    e.preventDefault();
    setStatus({ ...status, submitted: true, resending: true });

    resetActivationLink(data.email, data.password)
      .then(res => {
        if (res.status === 'success') {
          setStatus({
            resending: false,
            resent: true,
            resendSuccess: true
          });
        } else throw res.data;
      })
      .catch(err => {
        setStatus({
          resending: false,
          resent: true,
          resendSuccess: false
        });
      });
  };

  useEffect(() => {
    if (id && activateToken) {
      activate(id, activateToken)
        .then(res => {
          if (res.status === 'success') {
            setStatus({ ...status, activated: true });
            setFirstRender(false);
          } else throw res.data;
        })
        .catch(err => {
          setStatus({ ...status, activated: false });
          setFirstRender(false);
        });
    } else {
      setFirstRender(false);
    }
  }, []);

  const intro = (
    <div className='content page-activation'>
      {!request ? (
        !status.activated ? (
          <div className='fadedin'>
            <p className='font-short-extra font-white'>
              The activation link has expired, please try a new one.
            </p>
            <ButtonFrame
              onClick={() => {
                setRequest(true);
              }}
            >
              Re-send activation link
            </ButtonFrame>
          </div>
        ) : (
          <div className='fadein'>
            <p className='font-short-extra font-white'>
              Your account has been successfully activated.
            </p>
            <a
              href='/login'
              className='link underline font-white'
            >
              Sign in
            </a>
          </div>
        )
      ) : status.resending ? (
        <div className='fadein d-flex flex-column align-items-center'>
          <div className='pb-2'>
            <span className='font-short-big font-white'>
              Resending activation link.
            </span>
          </div>
          <img src={Loading} width='25px' height='25px' />
        </div>
      ) : (
        <form className='table-layout fadein' onSubmit={handleResend}>
          {status.resent ? (
            <div className='table-row'>
              <span></span>
              {status.resendSuccess ? (
                <CardSuccess message='Check email for new activation link.' />
              ) : (
                <CardError message='Failed to send activation link.' />
              )}
            </div>
          ) : (
            ''
          )}
          <div className='table-row'>
            <span className='font-short-big font-white'>Email</span>
            <InputText
              type='text'
              name='email'
              placeholder='Account email'
              value={data.email}
              onChange={handleChangeData}
              error={status.submitted && !data.email}
              errMessage='Please provide your email'
            />
          </div>
          <div className='table-row'>
            <span className='font-short-big font-white'>Password</span>
            <InputText
              type='password'
              name='password'
              placeholder='Account email'
              value={data.password}
              onChange={handleChangeData}
              error={status.submitted && !data.password}
              errMessage='Password is required'
            />
          </div>
          <div className='table-row'>
            <span></span>
            <ButtonMain type='submit' disabled={status.resending}>
              Resend activation link
            </ButtonMain>
          </div>
        </form>
      )}
    </div>
  );

  return firstRender ? '' : <Landing intro={intro} short={true} />;
}

export default ActivationResult;
