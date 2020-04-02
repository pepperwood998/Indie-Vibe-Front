import React, { useContext, useState } from 'react';
import { login } from '../../apis';
import { getAccount } from '../../apis/API';
import { LogoIcon } from '../../assets/svgs';
import { CardError } from '../../components/cards';
import { AuthContext, MeContext } from '../../contexts';
import { ButtonRegular } from './components/buttons';
import { InputTextRegular } from './components/inputs';
import './css/cms.scss';

function CMSLogin(props) {
  const { actions: authActions, dispatch: authDispatch } = useContext(
    AuthContext
  );
  const { actions: meActions, dispatch: meDispatch } = useContext(MeContext);

  const [status, setStatus] = useState({
    submitted: false,
    formErr: false,
    submitErr: ''
  });
  const [data, setData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = e => {
    e.preventDefault();
    if (!data.username || !data.password) {
      setStatus({ ...status, formErr: true });
      return;
    }

    setStatus({ ...status, submitted: true, submitErr: '' });
    login(data.username, data.password)
      .then(res => {
        setStatus({ ...status, submitted: false });
        if (!res['access_token']) throw 'Wrong username or password';

        return getAccount(res['access_token']).then(accountRes => {
          if (accountRes.status === 'success') {
            if (accountRes.data.role.id !== 'r-admin') {
              throw 'The account does not have admin priviledge';
            }

            meDispatch(meActions.loadMe(accountRes.data));
            authDispatch(authActions.loginSuccess({ ...res }));
          } else {
            throw 'Unexpected error, try again!';
          }
        });
      })
      .catch(err => {
        setStatus({ ...status, submitted: false });
        if (typeof err !== 'string') {
          err = 'Server error';
        }
        setStatus({ ...status, submitErr: err });
      });
  };

  const handleChangeData = e => {
    setData({
      ...data,
      [e.target.getAttribute('name')]: e.target.value
    });
  };

  return (
    <div className='cms-login'>
      <div className='cms-login__header'>
        <div className='banner'>
          <LogoIcon className='logo' />
          <span className='title font-short-extra font-white font-weight-bold'>
            CMS Login
          </span>
        </div>
      </div>
      <div className='cms-login__body'>
        <div className='form-wrapper'>
          <section className='header text-center font-short-big'>
            Login to the CMS board
          </section>
          {status.submitErr ? (
            <section>
              <CardError message={status.submitErr} />
            </section>
          ) : (
            ''
          )}
          <section>
            <form className='table-layout' onSubmit={handleSubmit}>
              <div className='table-row'>
                <span className='right font-short-regular font-weight-bold'>
                  CMS username:
                </span>
                <InputTextRegular
                  name='username'
                  placeholder='Username'
                  error={status.formErr && data.username === ''}
                  errMessage='Username required*'
                  value={data.username}
                  onChange={handleChangeData}
                />
              </div>
              <div className='table-row'>
                <span className='right font-short-regular font-weight-bold'>
                  CMS password:
                </span>
                <InputTextRegular
                  name='password'
                  type='password'
                  placeholder='Password'
                  error={status.formErr && data.password === ''}
                  errMessage='Password required*'
                  value={data.password}
                  onChange={handleChangeData}
                />
              </div>
              <div className='table-row'>
                <span></span>
                <ButtonRegular type='submit' disabled={status.submitted}>
                  Login
                </ButtonRegular>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CMSLogin;
