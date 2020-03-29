import React, { useState } from 'react';
import { getFbPictureUrl, register, registerWithFb } from '../../apis/AuthAPI';
import { LogoRegister } from '../../assets/svgs';
import { ButtonFacebook, ButtonMain } from '../../components/buttons/';
import { CardError, CardSuccess } from '../../components/cards';
import { InputForm, InputRadioBox } from '../../components/inputs';
import Authentication from './Authentication';

function Register() {
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registeringFb, setRegisteringFb] = useState(false);

  const [registerInputs, setRegisterInputs] = useState({
    email: '',
    pwd: '',
    cfPwd: '',
    displayName: '',
    gender: 0
  });
  const { email, pwd, cfPwd, displayName, gender } = registerInputs;

  const handleInputsChange = e => {
    setRegisterInputs({
      ...registerInputs,
      [e.target.getAttribute('name')]: e.target.value
    });
  };

  const handleRegister = e => {
    e.preventDefault();
    setSubmitted(true);
    setRegisterError('');
    setRegisterSuccess('');
    if (!email || !pwd || !cfPwd || !displayName) return;

    setRegistering(true);
    register(email, pwd, cfPwd, displayName, gender)
      .then(response => response.json())
      .then(json => {
        if (json.status === 'fail') {
          throw { type: 'wrong', msg: json.data };
        } else {
          setRegisterSuccess(json.data);
        }

        setRegistering(false);
      })
      .catch(err => {
        if (err.type && err.type === 'wrong') {
          setRegisterError(err.msg);
        } else {
          setRegisterError('Server error');
        }

        setRegistering(false);
      });
  };

  const handleRegisterFb = () => {
    setRegisterError('');
    setRegisterSuccess('');
    setRegisteringFb(true);
  };

  const responseFacebook = response => {
    const { status } = response;
    if (status && status !== 'connected') {
      setRegisteringFb(false);
      return;
    }

    const { email, name, id, accessToken } = response;
    getFbPictureUrl(id)
      .then(response => response.url)
      .then(url => {
        registerWithFb(email, name, url, id, accessToken)
          .then(response => response.json())
          .then(json => {
            if (json.status === 'failed') {
              throw {
                type: 'wrong',
                msg: json.data
              };
            } else {
              setRegisterSuccess(json.data);
            }

            setRegisteringFb(false);
          })
          .catch(err => {
            if (err.type && err.type === 'wrong') {
              setRegisterError(err.msg);
            } else {
              setRegisterError('Server error');
            }

            setRegisteringFb(false);
          });
      });
  };

  const logo = () => <LogoRegister height='60' />;

  const inputs = () => (
    <form onSubmit={handleRegister}>
      {registerError ? <CardError message={registerError} /> : ''}
      {registerSuccess ? <CardSuccess message={registerSuccess} /> : ''}
      <InputForm
        type='text'
        placeholder='Enter your email address'
        onChange={handleInputsChange}
        error={email === '' && submitted}
        errMessage='Please enter your email'
        value={email}
        name='email'
      />
      <InputForm
        type='password'
        placeholder='Enter your password'
        onChange={handleInputsChange}
        error={pwd === '' && submitted}
        errMessage='Please enter your password'
        value={pwd}
        name='pwd'
      />
      <InputForm
        type='password'
        placeholder='Confirm your password'
        onChange={handleInputsChange}
        error={cfPwd === '' && submitted}
        errMessage='Please confirm your password'
        value={cfPwd}
        name='cfPwd'
      />
      <InputForm
        type='text'
        placeholder='Enter your display name'
        onChange={handleInputsChange}
        error={displayName === '' && submitted}
        errMessage='Tell us your name'
        value={displayName}
        name='displayName'
      />

      <div className='input-addition input-addition-inline'>
        <InputRadioBox
          name='gender'
          label='Female'
          value='0'
          checked={gender == 0}
          onChange={handleInputsChange}
        />
        <InputRadioBox
          name='gender'
          label='Male'
          value='1'
          checked={gender == 1}
          onChange={handleInputsChange}
        />
        <InputRadioBox
          name='gender'
          label='Other'
          value='2'
          checked={gender == 2}
          onChange={handleInputsChange}
        />
      </div>
      {gender == undefined && submitted ? (
        <CardError message={'Please provide your gender'} />
      ) : (
        ''
      )}
      <input type='submit' style={{ display: 'none' }}></input>
    </form>
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
      <ButtonFacebook
        isFitted={false}
        responseFacebook={responseFacebook}
        disabled={registeringFb}
        onClick={handleRegisterFb}
      >
        Register with Facebook
      </ButtonFacebook>
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
