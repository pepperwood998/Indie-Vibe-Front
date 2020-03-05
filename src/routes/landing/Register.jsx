import React, { useState } from 'react';

import { InputForm, RadioBox } from '../../components/inputs';
import { ButtonMain, ButtonFacebook } from '../../components/buttons/';
import Authentication from './Authentication';
import ErrorCard from '../../components/cards/ErrorCard';

import { LogoRegister } from '../../assets/svgs';
import './style.scss';

function Register() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [cfPwd, setCfPwd] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailChange = e => {
    setEmail(e.target.value);
  };

  const handlePwdChange = e => {
    setPwd(e.target.value);
  };

  const handleCfPwdChange = e => {
    setCfPwd(e.target.value);
  };

  const handleDisplayNameChange = e => {
    setDisplayName(e.target.checked);
  };

  const handleGenderChange = e => {
    setGender(e.target.value);
  };

  const handleRegister = () => {
    setSubmitted(true);
    setLoginError('');
    if (!email || !pwd || !cfPwd || !displayName) return;
  };

  const logo = () => <LogoRegister height='60' />;

  const inputs = () => (
    <React.Fragment>
      <InputForm
        type='text'
        placeholder='Enter your email address'
        onChange={handleEmailChange}
        error={email === '' && submitted}
        errMessage='Please enter your email'
      />
      <InputForm
        type='password'
        placeholder='Enter your password'
        onChange={handlePwdChange}
        error={pwd === '' && submitted}
        errMessage='Please enter your password'
      />
      <InputForm
        type='password'
        placeholder='Confirm your password'
        onChange={handleCfPwdChange}
        error={cfPwd === '' && submitted}
        errMessage='Please confirm your password'
      />
      <InputForm
        type='text'
        placeholder='Enter your display name'
        onChange={handleDisplayNameChange}
        error={displayName === '' && submitted}
        errMessage='Tell us your name'
      />

      <div className='input-addition input-addition-inline'>
        <RadioBox
          name='gender'
          label='Female'
          value='female'
          onChange={handleGenderChange}
        />
        <RadioBox
          name='gender'
          label='Male'
          value='male'
          onChange={handleGenderChange}
        />
        <RadioBox
          name='gender'
          label='Other'
          value='other'
          onChange={handleGenderChange}
        />
      </div>
      {!gender && submitted ? (
        <ErrorCard message={'Please provide your gender'} />
      ) : (
        ''
      )}
    </React.Fragment>
  );

  const submits = () => (
    <React.Fragment>
      <ButtonMain label='Register' isFitted={false} onClick={handleRegister} />
      <div
        style={{ padding: '7px', textAlign: 'center' }}
        className='font-regular font-gray-light'
      >
        or
      </div>
      <ButtonFacebook label='Register with Facebook' isFitted={false} />
    </React.Fragment>
  );

  const addition = () => (
    <React.Fragment>
      <div
        style={{ textAlign: 'center', padding: '10px' }}
        className='font-regular font-white'
      >
        Already a member?&nbsp;
        <a
          href='/login'
          className='font-blue-main link link-bright-blue-main'
        >
          Sign in
        </a>
      </div>
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

export default Register;
