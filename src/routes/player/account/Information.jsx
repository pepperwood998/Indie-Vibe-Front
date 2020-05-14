import React, { useContext, useRef, useState } from 'react';
import {
  cancelSubscription,
  getAccount,
  updateAccount
} from '../../../apis/API';
import AvatarPlaceholder from '../../../assets/imgs/avatar-placeholder.jpg';
import { ButtonMain } from '../../../components/buttons';
import {
  InputFileLabel,
  InputForm,
  InputRadioBox
} from '../../../components/inputs';
import { AuthContext, LibraryContext, MeContext } from '../../../contexts';
import {
  createDayOptions,
  createMonthOptions,
  createYearOptions,
  getDatePart,
  useEffectSkip
} from '../../../utils/Common';

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
  const dobArr = getDatePart(account.dob).split('-');

  const [dob, setDob] = useState({
    day: dobArr[2] || 1,
    month: dobArr[1] || 1,
    year: dobArr[0] || 1990
  });
  const [data, setData] = useState({
    displayName: [false, account.displayName],
    email: [false, account.email],
    gender: [false, account.gender],
    dob: [false, '']
  });
  const [thumbnailSrc, setThumbnailSrc] = useState(account.thumbnail);
  const [status, setStatus] = useState({
    submitted: false,
    updating: false
  });

  useEffectSkip(() => {
    setData({
      ...data,
      dob: [true, dob.year + '-' + dob.month + '-' + dob.day]
    });
  }, [dob]);

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

  const handleChangeGender = e => {
    setData({ ...data, gender: [true, parseInt(e.target.value)] });
  };

  const handleChangeDob = e => {
    const target = e.target;

    setDob({
      ...dob,
      [target.getAttribute('name')]: target.value
    });
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
            libDispatch(
              libActions.setNotification(true, true, 'Information updated')
            );
            return getAccount(authState.token, authState.id).then(res => {
              if (res.status === 'success') {
                meDispatch(meActions.loadMe(res.data));
              } else {
                throw 'Information updated, try logout and login again';
              }
            });
          case 'unchanged':
            libDispatch(
              libActions.setNotification(true, true, 'Information unchanged')
            );
            break;
          default:
            throw res.data;
        }
      })
      .catch(error => {
        setStatus({ ...status, updating: false });
        libDispatch(
          libActions.setNotification(
            true,
            false,
            typeof error === 'string' ? error : 'Failed to update information'
          )
        );
      });
  };

  const handleCancelSubscription = () => {
    libDispatch(
      libActions.setConfirmDialog(
        true,
        'Confirm cancel the subscription',
        () => {
          cancelSubscription(authState.token)
            .then(res => {
              if (res.status === 'success') {
                libDispatch(
                  libActions.setNotification(
                    true,
                    true,
                    'Successfully cancel subscription. Prepare to be log-out'
                  )
                );

                setTimeout(() => {
                  window.location.href = '/logout';
                }, 500);
              } else {
                throw res.data;
              }
            })
            .catch(err => {
              if (typeof err !== 'string') {
                err = 'Server error';
              }

              libDispatch(libActions.setNotification(true, false, err));
            });
        }
      )
    );
  };

  return (
    <div className='fadein content-padding'>
      <div className='body__bound'>
        <div className='account-information'>
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
              className='input-label--img img-wrapper edit'
            >
              <img
                className='img'
                src={thumbnailSrc ? thumbnailSrc : AvatarPlaceholder}
              />
            </InputFileLabel>
          </div>
          <div className='account-information__info'>
            <section className='plan-tier'>
              <GroupPlanBox
                role={account.role.id}
                plan={{
                  ...account.userPlan,
                  due: account.planDue
                }}
              />
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
                      onChange={handleChangeGender}
                    />
                    <InputRadioBox
                      name='gender'
                      label='Male'
                      value='1'
                      checked={data.gender[1] == 1}
                      onChange={handleChangeGender}
                    />
                    <InputRadioBox
                      name='gender'
                      label='Other'
                      value='2'
                      checked={data.gender[1] == 2}
                      onChange={handleChangeGender}
                    />
                  </div>
                </div>
                <div className='table-row'>
                  <span className='label'>Date of birth</span>
                  <div className='d-flex align-items-center dob'>
                    <section className='date-elem flex-1'>
                      <select
                        name='day'
                        className='custom-select'
                        value={parseInt(dob.day)}
                        onChange={handleChangeDob}
                      >
                        {createDayOptions()}
                      </select>
                    </section>
                    <section className='date-elem flex-1'>
                      <select
                        name='month'
                        className='custom-select'
                        value={parseInt(dob.month)}
                        onChange={handleChangeDob}
                      >
                        {createMonthOptions()}
                      </select>
                    </section>
                    <section className='date-elem flex-1'>
                      <select
                        name='year'
                        className='custom-select'
                        value={parseInt(dob.year)}
                        onChange={handleChangeDob}
                      >
                        {createYearOptions(1900, new Date().getFullYear() - 1)}
                      </select>
                    </section>
                  </div>
                </div>
                <div className='table-row'>
                  <span className='label'></span>
                  <div>
                    <ButtonMain
                      onClick={handleSubmit}
                      disabled={status.updating}
                    >
                      Save
                    </ButtonMain>
                  </div>
                </div>
              </div>
            </section>
            {account.userPlan.id !== 'p-monthly' ? (
              ''
            ) : (
              <section className='catalog'>
                <div className='catalog__header'>
                  <span className='font-short-extra font-gray-light'>
                    Cancel subscription
                  </span>
                </div>
                <ButtonMain
                  className='dangerous'
                  onClick={handleCancelSubscription}
                >
                  Cancel Subscription
                </ButtonMain>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupPlanBox(props) {
  const { plan } = props;

  const isCurator = props.role === 'r-curator';

  return (
    <div className='catalog'>
      <div className='catalog__header plan font-short-extra font-weight-bold font-white'>
        {isCurator ? 'Music Curator' : plan.name}
      </div>
      <div className='due font-short-regular font-gray-light'>
        {isCurator ? (
          <p>Your are a music curator.</p>
        ) : (
          <React.Fragment>
            <p>You are using Indie Vibe {plan.name}.</p>
            {plan.id === 'p-fixed' || plan.id === 'p-monthly' ? (
              plan.id === 'p-fixed' ? (
                <p>Premium ends at {new Date(plan.due).toString()}.</p>
              ) : (
                <p>Next payment will be at {new Date(plan.due).toString()}.</p>
              )
            ) : (
              ''
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default Information;
