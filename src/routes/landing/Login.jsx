import React, { useContext, useState } from 'react';
import { login } from '../../apis';
import { getAccount } from '../../apis/API';
import { loginFb } from '../../apis/AuthAPI';
import { LogoSignIn } from '../../assets/svgs';
import {
  ButtonFacebook,
  ButtonFrame,
  ButtonMain
} from '../../components/buttons';
import { CardError } from '../../components/cards';
import { InputCheckbox, InputForm } from '../../components/inputs';
import { AuthContext, MeContext } from '../../contexts';
import Authentication from './Authentication';
import Activation from './parts/Activation';

function Login() {
  const { actions: authActions, dispatch: authDispatch } = useContext(
    AuthContext
  );
  const { actions: meActions, dispatch: meDispatch } = useContext(MeContext);

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [remembered, setRemembered] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loggingInFb, setLoggingInFb] = useState(false);

  const { loginSuccess } = authActions;

  const handleEmailChange = e => {
    setEmail(e.target.value);
  };

  const handlePwdChange = e => {
    setPwd(e.target.value);
  };

  const handleRememberedChange = e => {
    setRemembered(e.target.checked);
  };

  const handleLogIn = e => {
    e.preventDefault();
    setSubmitted(true);
    setLoginError('');
    if (!email || !pwd) return;

    setLoggingIn(true);
    login(email, pwd)
      .then(res => {
        if (res.status === 'fail') throw res.data;

        return getAccount(res['access_token']).then(accountRes => {
          if (accountRes.status === 'success') {
            meDispatch(meActions.loadMe(accountRes.data));
            authDispatch(loginSuccess({ ...res, remembered }));
          } else {
            throw 'Unexpected error, try again!';
          }
        });
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Server error';
        } else if (err === 'unactive') {
          err = <Activation tryLogin email={email} />;
        }

        setPwd('');
        setLoggingIn(false);
        setLoginError(err);
      });
  };

  const handleLogInFb = () => {
    setLoggingInFb(true);
    setLoginError('');
  };

  const responseFacebook = response => {
    const { status } = response;
    if (status && status !== 'connected') {
      setLoggingInFb(false);
      return;
    }

    const { id, accessToken, email } = response;
    loginFb(id, accessToken)
      .then(res => {
        if (res.status === 'fail') throw res.data;

        return getAccount(res['access_token']).then(res => {
          if (res.status === 'success') {
            meDispatch(meActions.loadMe(res.data));
            authDispatch(loginSuccess({ ...res, remembered }));
          } else throw 'Unexpected error, try again!';
        });
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Server error';
        } else if (err === 'unactive') {
          err = <Activation tryLogin email={email} />;
        }

        setLoggingInFb(false);
        setLoginError(err);
      });
  };

  const logo = () => <LogoSignIn height='60' />;

  const inputs = () => (
    <React.Fragment>
      {loginError ? <CardError message={loginError} /> : ''}
      <InputForm
        type='text'
        placeholder='Your email address'
        onChange={handleEmailChange}
        error={email === '' && submitted}
        errMessage='Email required'
        value={email}
      />

      <InputForm
        type='password'
        placeholder='Your password'
        onChange={handlePwdChange}
        error={pwd === '' && submitted}
        errMessage='Please enter your password'
        value={pwd}
      />

      <div className='input-addition input-addition-span'>
        <InputCheckbox label='Remember me' onChange={handleRememberedChange} />
        <a
          href='#'
          className='font-tall-r font-weight-bold font-blue-main link link-bright-blue-main'
        >
          Forgot your password?
        </a>
      </div>
    </React.Fragment>
  );

  const submits = () => (
    <React.Fragment>
      <ButtonMain full={true} type='submit' disabled={loggingIn}>
        Enter
      </ButtonMain>
      <div
        style={{ padding: '7px', textAlign: 'center' }}
        className='font-short-regular font-weight-bold font-gray-light'
      >
        or
      </div>
      <ButtonFacebook
        full
        responseFacebook={responseFacebook}
        onClick={handleLogInFb}
        disabled={loggingInFb}
      >
        Sign in with Facebook
      </ButtonFacebook>
    </React.Fragment>
  );

  const addition = () => (
    <React.Fragment>
      <div
        style={{ textAlign: 'center', padding: '10px' }}
        className='font-short-regular font-weight-bold font-white'
      >
        Not a member yet?
      </div>
      <a href='/register'>
        <ButtonFrame>Join Indie Vibe</ButtonFrame>
      </a>
    </React.Fragment>
  );

  return (
    <Authentication
      logo={logo()}
      inputs={inputs()}
      submits={submits()}
      addition={addition()}
      handleSubmit={handleLogIn}
    />
  );
}

export default Login;
