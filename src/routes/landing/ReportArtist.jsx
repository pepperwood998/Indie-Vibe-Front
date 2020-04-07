import React, { useContext, useEffect, useState } from 'react';
import { getReportTypeList, reportArtist } from '../../apis/API';
import { ButtonMain } from '../../components/buttons';
import { InputRadioBox, InputTextarea } from '../../components/inputs';
import { AuthContext, LibraryContext } from '../../contexts';
import Landing from './Landing';

function ReportArtist(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const [reportTypes, setReportTypes] = useState([]);
  const [status, setStatus] = useState({
    firstRender: true,
    submitted: false,
    submitting: false,
    submitSuccess: false
  });
  const [data, setData] = useState({
    type: 'rpt-brand',
    reason: ''
  });

  const { id } = props.match.params;

  useEffect(() => {
    getReportTypeList(authState.token)
      .then(res => {
        setStatus({ ...status, firstRender: false });
        if (res.status === 'success') {
          setReportTypes(res.data);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleChangeReportInfo = e => {
    const { target } = e;
    setData({ ...data, [target.getAttribute('name')]: target.value });
  };

  const handleSubmit = () => {
    setStatus({ ...status, submitted: true });
    if (!data.type || !data.reason) return;

    setStatus({ ...status, submitting: true });
    reportArtist(authState.token, id, data)
      .then(res => {
        if (res.status === 'success') {
          setStatus({ ...status, submitting: false, submitSuccess: true });
        } else {
          throw res.data;
        }
      })
      .catch(err => {
        setStatus({ ...status, submitting: false });
        if (typeof err !== 'string') {
          err = 'Server error';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
  };

  const intro = status.firstRender ? (
    ''
  ) : (
    <div className='content'>
      {status.submitSuccess ? (
        <div className='success-box fadein'>
          <section>
            <h2 className='header'>Report Submitted Successully</h2>
            <p className='content'>
              Thank you for reporting your problem. We will look into this
              shortly.
            </p>
          </section>
          <section className='clearfix'>
            <a
              href='/player'
              className='font-short-regular font-white link-underline float-right'
            >
              Back to Player
            </a>
          </section>
        </div>
      ) : (
        <React.Fragment>
          <section className='report-types-box'>
            <h2 className='header'>
              <span>Report about an Artist</span>
            </h2>
            <div className='content'>
              <ul>
                {reportTypes.map((type, i) => (
                  <li key={i} className='type'>
                    <InputRadioBox
                      name='type'
                      label={type.name}
                      value={type.id}
                      className='radio'
                      checked={data.type === type.id}
                      onChange={handleChangeReportInfo}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className='reason-box'>
            <InputTextarea
              placeholder='Enter your reason'
              name='reason'
              value={data.reason}
              error={status.submitted && !data.reason}
              disabled={status.submitting}
              errMessage='You need to provide a report reason!'
              onChange={handleChangeReportInfo}
            />
          </section>
          <section className='submit-box'>
            <ButtonMain
              isFitted
              onClick={handleSubmit}
              disabled={status.submitting}
            >
              {status.submitting ? 'SENDING...' : 'SUBMIT'}
            </ButtonMain>
          </section>
        </React.Fragment>
      )}
    </div>
  );

  return <Landing intro={intro} short={true} />;
}

export default ReportArtist;
