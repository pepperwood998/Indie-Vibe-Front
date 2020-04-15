import React, { useContext, useEffect, useState } from 'react';
import { getReportTypeList } from '../../../apis/API';
import { processReport } from '../../../apis/APICms';
import AvatarPlaceholder from '../../../assets/imgs/avatar-placeholder.jpg';
import { AuthContext, LibraryContext } from '../../../contexts';
import { getDatePart, statusModel } from '../../../utils/Common';
import { ButtonQuick } from '../components/buttons';
import { TableReportRequests } from '../components/tables';

function Reports(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const [form, setForm] = useState({
    type: 'all',
    status: 'all',
    types: [],
    processStatus: ''
  });
  const [extra, setExtra] = useState({
    selectedReport: null,
    processedId: '',
    processedStatus: ''
  });

  const { selectedReport } = extra;

  useEffect(() => {
    getReportTypeList(authState.token)
      .then(res => {
        if (res.status === 'success' && res.data) {
          setForm({
            ...form,
            types: [{ id: 'all', name: '--Select all--' }, ...res.data]
          });
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleChangeForm = e => {
    const target = e.target;
    setForm({ ...form, [target.getAttribute('name')]: target.value });
  };

  const handleProcessReport = (id, action) => {
    processReport(authState.token, id, action)
      .then(res => {
        if (res.status === 'success') {
          libDispatch(
            libActions.setNotification(true, true, `Report ${action}ed`)
          );

          setExtra({
            ...extra,
            processedId: id,
            processedStatus: action + 'ed'
          });
        } else throw res.data;
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Error processing report';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
  };

  return (
    <div className='mono-page-wrapper'>
      <div className='mono-page page-reports fadein d-flex padder'>
        <section className='flex-1 boxy catalog-menu mr-3'>
          <div className='header'>
            <span className='font-short-big'>Browse recent reports</span>
          </div>
          <div className='content'>
            <div className='d-flex'>
              <label
                htmlFor='report-type'
                className='label d-flex align-items-center pr-2 font-short-s'
              >
                Report type
              </label>
              <select
                id='report-type'
                name='type'
                value={form.type}
                className='custom-select'
                onChange={handleChangeForm}
              >
                {form.types.map((type, i) => (
                  <option key={i} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <div className='d-flex align-items-center pl-3'>
                {Object.keys(statusModel.report).map((key, i) => (
                  <div className='pl-2' key={i}>
                    <input
                      type='radio'
                      id={key}
                      name='status'
                      value={key}
                      onChange={handleChangeForm}
                    />
                    <label className='font-short-s' htmlFor={key}>
                      {statusModel.report[key]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <TableReportRequests
              type={form.type}
              rptStatus={form.status}
              onView={report => {
                setExtra({
                  ...extra,
                  selectedReport: { ...report }
                });
              }}
              onProcess={report => {
                setExtra({
                  ...extra,
                  selectedReport: { ...report },
                  processedId: '',
                  processedStatus: ''
                });
              }}
              withActions
              processed={{
                id: extra.processedId,
                status: extra.processedStatus
              }}
            />
          </div>
        </section>
        <section className='report-details flex-1 boxy catalog-menu'>
          <div className='header'>
            {!selectedReport ? (
              <span className='font-short-big'>
                Select report from browsing
              </span>
            ) : (
              <div className='d-flex align-items-center'>
                <div className='thumbnail'>
                  <div className='img-wrapper'>
                    <img
                      className='img'
                      src={
                        selectedReport.reporter.thumbnail
                          ? selectedReport.reporter.thumbnail
                          : AvatarPlaceholder
                      }
                    />
                  </div>
                </div>
                <div className='flex-1 info pl-3'>
                  <span className='font-short-big font-weight-bold d-block'>
                    {selectedReport.reporter.displayName}
                  </span>
                  <span className='font-short-s'>
                    {getDatePart(selectedReport.date)}
                  </span>
                </div>
                <div className='d-flex'>
                  {selectedReport.status !== 'pending' ? (
                    <ButtonStatus status={selectedReport.status} />
                  ) : (
                    <React.Fragment>
                      <ButtonQuick
                        type='approve'
                        onClick={() =>
                          handleProcessReport(selectedReport.id, 'proceed')
                        }
                        className='mr-1'
                      >
                        PROCEED
                      </ButtonQuick>
                      <ButtonQuick
                        type='deny'
                        onClick={() =>
                          handleProcessReport(selectedReport.id, 'reject')
                        }
                      >
                        REJECT
                      </ButtonQuick>
                    </React.Fragment>
                  )}
                </div>
              </div>
            )}
          </div>
          {!selectedReport ? (
            ''
          ) : (
            <div className='content'>
              <a
                className='font-short-s'
                href={`/player/artist/${selectedReport.artist.id}`}
              >
                #View artist page
              </a>
              <h3 className='font-short-extra font-weight-bold'>
                {selectedReport.type.name}
              </h3>
              <p className='font-short-big'>{selectedReport.reason}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ButtonStatus({ status = 'pending' }) {
  let type = '';
  switch (status) {
    case 'proceeded':
      type = 'approve';
      break;
    case 'rejected':
      type = 'deny';
      break;
    default:
      type = 'regular';
  }

  return (
    <ButtonQuick type={type} disabled={true}>
      {status}
    </ButtonQuick>
  );
}

export default Reports;
