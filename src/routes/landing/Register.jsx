import React, { useState } from 'react';

import { InputForm, RadioBox } from '../../components/inputs';
import { ButtonMain, ButtonFacebook } from '../../components/buttons/';
import Authentication from './Authentication';
import { register } from '../../apis/AuthAPI';

import { LogoRegister } from '../../assets/svgs';
import './style.scss';
import ErrorCard from '../../components/cards/ErrorCard';
import SuccessCard from '../../components/cards/SuccessCard';

function Register() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [cfPwd, setCfPwd] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [registering, setRegistering] = useState(false);

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
    setDisplayName(e.target.value);
  };

  const handleGenderChange = e => {
    setGender(e.target.value);
  };

  const handleRegister = () => {
    setSubmitted(true);
    setRegisterError('');
    setRegisterSuccess('');
    if (!email || !pwd || !cfPwd || !displayName || !gender) return;

    setRegistering(true);
    register(email, pwd, cfPwd, displayName, gender)
      .then(response => response.json())
      .then(json => {
        if (json.status === 'failed') {
          setRegisterError(json.data);
        } else {
          setRegisterSuccess(json.data);
        }

        setRegistering(false);
      });
  };

  const logo = () => <LogoRegister height='60' />;

  const inputs = () => (
    <React.Fragment>
      {registerError ? <ErrorCard message={registerError} /> : ''}
      {registerSuccess ? <SuccessCard message={registerSuccess} /> : ''}
      <InputForm
        type='text'
        placeholder='Enter your email address'
        onChange={handleEmailChange}
        error={email === '' && submitted}
        errMessage='Please enter your email'
        value={email}
      />
      <InputForm
        type='password'
        placeholder='Enter your password'
        onChange={handlePwdChange}
        error={pwd === '' && submitted}
        errMessage='Please enter your password'
        value={pwd}
      />
      <InputForm
        type='password'
        placeholder='Confirm your password'
        onChange={handleCfPwdChange}
        error={cfPwd === '' && submitted}
        errMessage='Please confirm your password'
        value={cfPwd}
      />
      <InputForm
        type='text'
        placeholder='Enter your display name'
        onChange={handleDisplayNameChange}
        error={displayName === '' && submitted}
        errMessage='Tell us your name'
        value={displayName}
      />

      <div className='input-addition input-addition-inline'>
        <RadioBox
          name='gender'
          label='Female'
          value='0'
          onChange={handleGenderChange}
        />
        <RadioBox
          name='gender'
          label='Male'
          value='1'
          onChange={handleGenderChange}
        />
        <RadioBox
          name='gender'
          label='Other'
          value='2'
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
      <ButtonMain
        isFitted={false}
        onClick={handleRegister}
        disabled={registering}
      >
        Register
      </ButtonMain>
      <div
        style={{ padding: '7px', textAlign: 'center' }}
        className='font-short-regular font-weight-bold font-gray-light'
      >
        or
      </div>
      <ButtonFacebook isFitted={false}>Register with Facebook</ButtonFacebook>
    </React.Fragment>
  );

  const addition = () => (
    <React.Fragment>
      <div
        style={{ textAlign: 'center', padding: '10px' }}
        className='font-short-regular font-weight-bold font-white'
      >
        Already a member?&nbsp;
        <a href='/login' className='font-blue-main link link-bright-blue-main'>
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
