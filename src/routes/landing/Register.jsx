import React, { useState } from 'react';

import { ReactComponent as LogoRegister } from '../../assets/svgs/logo-register.svg';

import './style.scss';
import { InputForm, RadioBox } from '../../components/inputs';
import { ButtonMain, ButtonFacebook } from '../../components/buttons/';
import Authentication from './Authentication';

function Register() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [cfPwd, setCfPwd] = useState('');
  const [displayName, setDisplayName] = useState(false);
  const [gender, setGender] = useState(false);

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

  const handleRegister = () => {};

  const logo = () => <LogoRegister height='60' />;

  const inputs = () => (
    <React.Fragment>
      <InputForm
        type='text'
        placeholder='Enter your email address'
        onChange={handleEmailChange}
      />
      <InputForm
        type='password'
        placeholder='Enter your password'
        onChange={handlePwdChange}
      />
      <InputForm
        type='password'
        placeholder='Confirm your password'
        onChange={handleCfPwdChange}
      />
      <InputForm
        type='text'
        placeholder='Enter your display name'
        onChange={handleDisplayNameChange}
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
    </React.Fragment>
  );

  const submits = () => (
    <React.Fragment>
      <ButtonMain label='Register' isFitted={false} onClick={handleRegister} />
      <div
        style={{ padding: '7px', textAlign: 'center' }}
        className='font-short-b font-gray-light'
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
        className='font-short-b font-white'
      >
        Already a member?
        <a
          href='/login'
          className='font-short-b font-blue-main link link-bright-blue-main'
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
