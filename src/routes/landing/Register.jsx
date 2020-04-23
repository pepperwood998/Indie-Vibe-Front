import React, { useState } from 'react';
import {
  getFbPictureUrl,
  register,
  registerWithFb,
  resetActivationLink
} from '../../apis/AuthAPI';
import Loading from '../../assets/imgs/loading.gif';
import { LogoRegister } from '../../assets/svgs';
import { ButtonFacebook, ButtonMain } from '../../components/buttons/';
import { CardError, CardSuccess } from '../../components/cards';
import { InputForm, InputRadioBox } from '../../components/inputs';
import Tooltip from '../../components/tooltips/Tooltip';
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
      .then(res => {
        if (res.status === 'success') {
          setRegisterSuccess(
            <RegisterActivation email={email} password={pwd} />
          );
        } else throw res.data;

        setRegistering(false);
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Server error';
        }

        setRegisterError(err);
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
          .then(res => {
            if (res.status === 'success') {
              setRegisterSuccess(res.data);
            } else throw res.data;

            setRegisteringFb(false);
          })
          .catch(err => {
            if (typeof err !== 'string') {
              err = 'Server error';
            } else {
              err = 'Email of the facebook account not available';
            }
            setRegisterError(err);
            setRegisteringFb(false);
          });
      });
  };

  const logo = () => <LogoRegister height='60' />;

  const inputs = () => (
    <React.Fragment>
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
      <Tooltip
        pos='right'
        tooltip='At least 8 characters, an uppercase, a number from 0-9'
      >
        <InputForm
          type='password'
          placeholder='Enter your password'
          onChange={handleInputsChange}
          error={pwd === '' && submitted}
          errMessage='Please enter your password'
          value={pwd}
          name='pwd'
        />
      </Tooltip>
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
    </React.Fragment>
  );

  const submits = () => (
    <React.Fragment>
      <ButtonMain full={true} type='submit' disabled={registering}>
        Register
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
      handleSubmit={handleRegister}
    />
  );
}

export const RegisterActivation = ({ email, password, login = false }) => {
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendFail, setResendFail] = useState(false);
  const [tryLogin, setTryLogin] = useState(login)

  const handleResend = () => {
    setResending(true);
    setResendFail(false);
    setTryLogin(false);

    resetActivationLink(email, password)
      .then(res => {
        if (res.status === 'success') {
          setResending(false);
          setResent(true);
        } else throw res.data;
      })
      .catch(err => {
        setResending(false);
        setResendFail(true);
      });
  };

  return !resending ? (
    <div className='fadein'>
      <div className='pb-2'>
        {tryLogin ? (
          <span>Your account is not activated</span>
        ) : resendFail ? (
          <span className='font-black'>Failed to send activation link.</span>
        ) : !resent ? (
          <span>An activation link has been sent to your email.</span>
        ) : (
          <span>Check email for your new activation link.</span>
        )}
      </div>
      <div>
        <span
          className='link underline link-underline font-gray-light'
          onClick={handleResend}
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
};

export default Register;
