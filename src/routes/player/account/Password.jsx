import React, { useContext, useState } from 'react';
import { updatePassword } from '../../../apis/API';
import { ButtonMain } from '../../../components/buttons';
import { InputForm } from '../../../components/inputs';
import Tooltip from '../../../components/tooltips/Tooltip';
import { AuthContext, LibraryContext } from '../../../contexts';

function Password(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const [data, setData] = useState({
    pwd: '',
    newPwd: '',
    cfNewPwd: ''
  });
  const [status, setStatus] = useState({
    submitted: false,
    updating: false
  });

  const handleChangeData = e => {
    setData({
      ...data,
      [e.target.getAttribute('name')]: e.target.value
    });
  };

  const handleUpdatePassword = () => {
    setStatus({ ...status, submitted: true });
    if (!data.pwd || !data.newPwd || data.cfNewPwd !== data.newPwd) {
      setData({ ...data, cfNewPwd: '' });
      return;
    }

    if (data.pwd === data.newPwd) {
      libDispatch(
        libActions.setNotification(
          true,
          false,
          'New password cannot be the same as the old one'
        )
      );
      setData({ ...data, newPwd: '', cfNewPwd: '' });
      return;
    }

    setStatus({ ...status, updating: true });
    updatePassword(authState.token, data)
      .then(res => {
        setStatus({ ...status, updating: false });
        if (res.status === 'success') {
          libDispatch(
            libActions.setNotification(true, true, 'Password refreshed')
          );
        } else {
          throw res.data;
        }
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Server error';
        }

        setStatus({ ...status, updating: false });
        libDispatch(libActions.setNotification(true, false, err));
      });
  };

  return (
    <div className='account-password fadein content-padding'>
      <div className='body__bound'>
        <div className='catalog'>
          <div className='catalog__header'>
            <span className='font-short-extra font-weight-bold font-white'>
              Refresh your password
            </span>
          </div>
          <div className='catalog__body'>
            <form className='form-password table-layout'>
              <div className='table-row'>
                <span className='label'>Legacy password</span>
                <InputForm
                  type='password'
                  placeholder='Your old password'
                  name='pwd'
                  autocomplete='new-password'
                  value={data.pwd}
                  onChange={handleChangeData}
                  error={
                    status.submitted && (!data.pwd || data.pwd === data.newPwd)
                  }
                  errMessage='Verify your old password'
                />
              </div>
              <div className='table-row'>
                <span className='label'>New password entry</span>
                <div>
                  <Tooltip
                    pos='right'
                    tooltip='At least 8 characters, and a number from 0-9'
                  >
                    <InputForm
                      type='password'
                      placeholder='Fresh password'
                      name='newPwd'
                      autocomplete='new-password'
                      value={data.newPwd}
                      onChange={handleChangeData}
                      error={status.submitted && !data.newPwd}
                      errMessage='Please enter your desired new password'
                    />
                  </Tooltip>
                </div>
              </div>
              <div className='table-row'>
                <span className='label'>Confirm password</span>
                <InputForm
                  type='password'
                  placeholder='Confirm your fresh password'
                  name='cfNewPwd'
                  autocomplete='new-password'
                  value={data.cfNewPwd}
                  onChange={handleChangeData}
                  error={status.submitted && data.cfNewPwd !== data.newPwd}
                  errMessage='Please confirm your new password'
                />
              </div>
              <div className='table-row'>
                <span className='label'></span>
                <div>
                  <ButtonMain
                    disabled={status.updating}
                    onClick={handleUpdatePassword}
                  >
                    Save password
                  </ButtonMain>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Password;
