import React, { useState } from 'react';
import { resetPassword } from '../../apis/AuthAPI';
import { ButtonMain } from '../../components/buttons';
import { CardError, CardSuccess } from '../../components/cards';
import { InputText } from '../../components/inputs';
import Landing from './Landing';

function ResetPassword() {
  const [form, setForm] = useState({
    requesting: false,
    success: '',
    error: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleReset = e => {
    e.preventDefault();
    setSubmitted(true);
    if (!email) return;
    setForm({ ...form, requesting: true, success: '', error: '' });

    resetPassword(email)
      .then(res => {
        if (res.status === 'success') {
          setForm({ ...form, requesting: false, success: res.data, error: '' });
        } else throw res.data;
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Server error';
        }

        setForm({ ...form, requesting: false, success: '', error: err });
      });
  };

  const intro = (
    <div className='content reset-password'>
      <h3 className='font-short-extra font-white font-weight-bold'>
        Request a new password
      </h3>

      {form.success || form.error ? (
        <div className='fadein'>
          <span></span>
          {form.success ? (
            <CardSuccess message={form.success} />
          ) : (
            <CardError message={form.error} />
          )}
        </div>
      ) : (
        ''
      )}
      <form className='table-layout fadein' onSubmit={handleReset}>
        <div className='table-row'>
          <span className='font-short-big font-white'>Email</span>
          <InputText
            type='text'
            name='email'
            placeholder='Your account email'
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
            error={submitted && !email}
            errMessage='Please provide your email'
          />
        </div>
        <div className='table-row'>
          <span></span>
          <ButtonMain type='submit' disabled={form.requesting}>
            RESET
          </ButtonMain>
        </div>
      </form>
    </div>
  );
  return <Landing intro={intro} short />;
}

export default ResetPassword;
