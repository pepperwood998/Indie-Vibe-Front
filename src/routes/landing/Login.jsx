import React, { useState, useContext } from 'react';

import { ReactComponent as LogoSignIn } from '../../assets/svgs/logo-sign-in.svg';

import './style.scss';
import { InputForm, Checkbox } from '../../components/inputs';
import {
  ButtonMain,
  ButtonFacebook,
  ButtonFrame
} from '../../components/buttons/';
import Authentication from './Authentication';
import { AuthContext } from '../../contexts/AuthContext';
import { login } from '../../apis';

function Login() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [remembered, setRemembered] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { actions, dispatch } = useContext(AuthContext);
  const { loginSuccess } = actions;

  const handleEmailChange = e => {
    setEmail(e.target.value);
  };

  const handlePwdChange = e => {
    setPwd(e.target.value);
  };

  const handleRememberedChange = e => {
    setRemembered(e.target.checked);
  };

  const handleLogIn = () => {
    login(email, pwd)
      .then(response => response.json())
      .then(json => {
        dispatch(loginSuccess(json));
      })
      .catch(err => setLoginError('Fail to login'));
  };

  const logo = () => <LogoSignIn height='60' />;

  const inputs = () => (
    <React.Fragment>
      <h3>{loginError}</h3>
      <InputForm
        type='text'
        placeholder='Your email address'
        onChange={handleEmailChange}
      />

      <InputForm
        type='password'
        placeholder='Your password'
        onChange={handlePwdChange}
      />

      <div className='input-addition input-addition-span'>
        <Checkbox label='Remember me' onChange={handleRememberedChange} />
        <a
          href='#'
          className='font-tall-b font-blue-main link link-bright-blue-main'
        >
          Forgot your password?
        </a>
      </div>
    </React.Fragment>
  );

  const submits = () => (
    <React.Fragment>
      <ButtonMain label='Enter' isFitted={false} onClick={handleLogIn} />
      <div
        style={{ padding: '7px', textAlign: 'center' }}
        className='font-short-b font-gray-light'
      >
        or
      </div>
      <ButtonFacebook label='Sign in with Facebook' isFitted={false} />
    </React.Fragment>
  );

  const addition = () => (
    <React.Fragment>
      <div
        style={{ textAlign: 'center', padding: '10px' }}
        className='font-short-b font-white'
      >
        Not a member yet?
      </div>
      <a href='/register'>
        <ButtonFrame label='Join Indie Vibe' />
      </a>
    </React.Fragment>
  );

  return (
    <Authentication
      logo={logo()}
      inputs={inputs()}
      submits={submits()}
      addition={addition()}
    />
  );
}

export default Login;
