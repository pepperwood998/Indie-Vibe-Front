import React, { useContext, useRef, useState } from 'react';
import { getProfile, updateAccount, getAccount } from '../../../apis/API';
import AvatarPlaceholder from '../../../assets/imgs/avatar-placeholder.jpg';
import { ButtonMain } from '../../../components/buttons';
import {
  InputFileLabel,
  InputForm,
  InputRadioBox
} from '../../../components/inputs';
import { AuthContext, LibraryContext, MeContext } from '../../../contexts';
import { getDatePart } from '../../../utils/Common';

function Information(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);
  const {
    state: meState,
    actions: meActions,
    dispatch: meDispatch
  } = useContext(MeContext);

  const thumbnailRef = useRef();

  const account = meState;

  const [data, setData] = useState({
    displayName: [false, account.displayName],
    email: [false, account.email],
    gender: [false, account.gender],
    dob: [false, account.dob]
  });
  const [thumbnailSrc, setThumbnailSrc] = useState(account.thumbnail);
  const [status, setStatus] = useState({
    submitted: false,
    updating: false
  });

  const handleChangeInfo = e => {
    setData({
      ...data,
      [e.target.getAttribute('name')]: [true, e.target.value]
    });
  };

  const handleChangeThumbnail = () => {
    let file = thumbnailRef.current.files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = e => {
        setData({ ...data, thumbnail: [true, file] });
        setThumbnailSrc(reader.result);
      };
    }
  };

  const handleSubmit = () => {
    setStatus({ ...status, submitted: true });
    if (
      (data.displayName[0] && !data.displayName[1]) ||
      (!account.fbId && data.email[0] && !data.email[1]) ||
      (data.dob[0] && !data.dob[1])
    )
      return;

    setStatus({ ...status, updating: true });
    updateAccount(authState.token, data)
      .then(res => {
        setStatus({ ...status, updating: false });
        switch (res.status) {
          case 'success':
            setData({
              ...data,
              displayName: [false, data.displayName[1]],
              email: [false, data.email[1]],
              gender: [false, data.gender[1]],
              dob: [false, data.dob[1]]
            });
            getAccount(authState.token, authState.id).then(res => {
              if (res.status === 'success') {
                meDispatch(meActions.loadMe(res.data));
              }
            });
            libDispatch(
              libActions.setNotification(true, true, 'Information updated')
            );
            break;
          case 'unchanged':
            libDispatch(
              libActions.setNotification(true, true, 'Information unchanged')
            );
            break;
          default:
            throw 'Error';
        }
      })
      .catch(error => {
        setStatus({ ...status, updating: false });
        libDispatch(
          libActions.setNotification(
            true,
            false,
            'Failed to update information'
          )
        );
      });
  };

  return (
    <div className='fadein content-padding'>
      <div className='account-information body__bound'>
        <div className='account-information__thumbnail'>
          <input
            type='file'
            ref={thumbnailRef}
            name='thumbnail'
            id='account-thumbnail'
            className='input-custom'
            accept='image/*'
            onChange={handleChangeThumbnail}
          />
          <InputFileLabel
            for='account-thumbnail'
            keep={true}
            className='input-label--img'
          >
            <img src={thumbnailSrc ? thumbnailSrc : AvatarPlaceholder} />
          </InputFileLabel>
        </div>
        <div className='account-information__info'>
          <section className='plan-tier catalog'>
            <div className='catalog__header plan font-short-extra font-weight-bold font-white'>
              Free
            </div>
            <div className='due font-short-regular font-gray-light'>
              Your are using Indie Vibe free.
            </div>
          </section>
          <section className='account-details catalog'>
            <div className='catalog__header font-short-extra font-weight-bold font-white'>
              Details
            </div>
            <div className='details table-layout'>
              <div className='table-row'>
                <span className='label'>Display name</span>
                <InputForm
                  placeholder='Your display name'
                  name='displayName'
                  value={data.displayName[1]}
                  onChange={handleChangeInfo}
                  error={status.submitted && !data.displayName[1]}
                  errMessage='What will we call your?'
                />
              </div>
              <div className='table-row'>
                <span className='label'>Email</span>
                <InputForm
                  placeholder='Email address'
                  name='email'
                  value={data.email[1]}
                  onChange={handleChangeInfo}
                  error={status.submitted && !account.fbId && !data.email[1]}
                  errMessage='Your account need an email'
                />
              </div>
              <div className='table-row'>
                <span className='label'>Gender</span>
                <div className='genders'>
                  <InputRadioBox
                    name='gender'
                    label='Female'
                    value='0'
                    checked={data.gender[1] == 0}
                    onChange={handleChangeInfo}
                  />
                  <InputRadioBox
                    name='gender'
                    label='Male'
                    value='1'
                    checked={data.gender[1] == 1}
                    onChange={handleChangeInfo}
                  />
                  <InputRadioBox
                    name='gender'
                    label='Other'
                    value='2'
                    checked={data.gender[1] == 2}
                    onChange={handleChangeInfo}
                  />
                </div>
              </div>
              <div className='table-row'>
                <span className='label'>Date of birth</span>
                <InputForm
                  type='date'
                  placeholder='Your birthday'
                  name='dob'
                  value={getDatePart(data.dob[1])}
                  onChange={handleChangeInfo}
                  error={status.submitted && data.dob[0] && !data.dob[1]}
                />
              </div>
              <div className='table-row'>
                <span className='label'></span>
                <div>
                  <ButtonMain
                    isFitted={true}
                    onClick={handleSubmit}
                    disabled={status.updating}
                  >
                    Save
                  </ButtonMain>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Information;
