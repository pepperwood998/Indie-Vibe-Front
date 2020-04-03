import React, { useContext, useState } from 'react';
import { createCurator } from '../../../apis/APICms';
import { CardError, CardSuccess } from '../../../components/cards';
import { AuthContext } from '../../../contexts';
import { ButtonRegular } from '../components/buttons';
import { InputTextRegular } from '../components/inputs';

function CreateCurator(props) {
  const { state: authState } = useContext(AuthContext);

  const [data, setData] = useState({
    displayName: ''
  });
  const [result, setResult] = useState({
    email: '',
    password: ''
  });
  const [status, setStatus] = useState({
    submitted: false,
    formErr: false,
    submitErr: '',
    submitSuccess: '',
    showPassword: false
  });

  const handleChangeData = e => {
    setData({
      ...data,
      [e.target.getAttribute('name')]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!data.displayName) {
      setStatus({ ...status, formErr: true });
      return;
    }

    setStatus({ ...status, submitted: true, submitErr: '' });
    createCurator(authState.token, data.displayName)
      .then(res => {
        setStatus({ ...status, submitted: false });
        if (res.status === 'success' && res.data) {
          setResult({ ...result, ...res.data });
          setStatus({ ...status, submitSuccess: 'A new curator is created' });
        } else {
          throw res.data;
        }
      })
      .catch(err => {
        setStatus({ ...status, submitted: false });
        if (typeof err !== 'string') {
          err = 'Server error';
        }

        setStatus({ ...status, submitErr: err });
      });
  };

  return (
    <div className='mono-page-wrapper'>
      <div className='mono-page page-create-curator fadein'>
        <section className='input-box section'>
          <div className='header'>Curator default information</div>
          <div className='content'>
            <form onSubmit={handleSubmit}>
              {status.submitErr ? <CardError message={status.submitErr} /> : ''}
              {status.submitSuccess ? (
                <CardSuccess message={status.submitSuccess} />
              ) : (
                ''
              )}
              <InputTextRegular
                name='displayName'
                placeholder='Default display name'
                value={data.displayName}
                onChange={handleChangeData}
                error={status.formErr && data.displayName === ''}
                errMessage='Display name required*'
              />
              <ButtonRegular
                className='float-right'
                type='submit'
                disabled={status.submitted}
              >
                Create
              </ButtonRegular>
            </form>
          </div>
        </section>
        <section className='result-box section'>
          <div className='header'>Created account information</div>
          <div className='content'>
            <ul className='table-layout'>
              <li className='table-row'>
                <span className='font-short-s'>Email:</span>
                <span className='font-short-s'>{result.email}</span>
              </li>
              <li className='table-row'>
                <span className='font-short-s'>Password:</span>
                {result.password ? (
                  <span className='font-short-s d-flex align-items-center'>
                    <span>
                      {status.showPassword ? result.password : '********'}
                    </span>
                    <span
                      className='btn-quick regular ml-3'
                      onClick={() => {
                        setStatus({
                          ...status,
                          showPassword: !status.showPassword
                        });
                      }}
                    >
                      {status.showPassword ? 'HIDE' : 'SHOW'}
                    </span>
                  </span>
                ) : (
                  ''
                )}
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CreateCurator;
