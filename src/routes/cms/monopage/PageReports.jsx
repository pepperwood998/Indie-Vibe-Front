import React, { useContext, useEffect, useState } from 'react';
import { getReportTypeList } from '../../../apis/API';
import { getReports, processReport } from '../../../apis/APICms';
import Placeholder from '../../../assets/imgs/placeholder.png';
import { ButtonLoadMore } from '../../../components/buttons';
import { AuthContext, LibraryContext } from '../../../contexts';
import { getDatePart, model, statusModel } from '../../../utils/Common';
import { ButtonQuick } from '../components/buttons';

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
  const [reports, setReports] = useState({ ...model.paging });
  const [extra, setExtra] = useState({
    selected: -1
  });

  const reportItems = reports.items;
  const selectedReport = reportItems[extra.selected];

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

  useEffect(() => {
    setExtra({ ...extra, selected: -1 });
    getReports(authState.token, form.type, form.status)
      .then(res => {
        if (res.status === 'success' && res.data) {
          setReports({ ...reports, ...res.data });
        } else throw res.data;
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Error getting reports';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
  }, [form.type, form.status]);

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

          const items = [...reports.items];
          items.some(report => {
            if (id === report.id) {
              report.status = action + 'ed';
              return true;
            }
          });
          setReports({ ...reports, items: [...items] });
        } else throw res.data;
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Error processing report';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
  };

  const handleLoadMore = () => {
    getReports(
      authState.token,
      form.type,
      form.status,
      reports.offset + reports.limit
    )
      .then(res => {
        if (res.status === 'success' && res.data) {
          const { data } = res;
          setReports({
            ...reports,
            ...data,
            items: [...reports.items, ...data.items]
          });
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
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
                className='label d-flex align-items-center pr-2'
              >
                Select year
              </label>
              <select
                id='report-type'
                name='type'
                value={form.year}
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

            {reports.total <= 0 ? (
              <div className='font-short-s font-style-italic m-3'>
                <span>No reports found</span>
              </div>
            ) : (
              <ul className='table-layout table-layout--collapse mt-3'>
                {reportItems.map((report, i) => {
                  const { reporter, artist } = report;

                  return (
                    <li key={i} className='table-row fadein'>
                      <div className='serial content-width center surround'>
                        <span>{i + 1}</span>
                      </div>
                      <div className='thumbnail-wrapper content-width over'>
                        <div className='thumbnail-reporter'>
                          <div className='img-wrapper'>
                            <img
                              className='img'
                              src={
                                reporter.thumbnail
                                  ? reporter.thumbnail
                                  : Placeholder
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className='info over pl-2'>
                        <div className='font-short-big font-weight-bold ellipsis one-line'>
                          {reporter.displayName}
                        </div>
                        <div className='font-short-s'>
                          {getDatePart(report.date)}
                        </div>
                      </div>
                      <div className='status content-width right'>
                        <ButtonStatus status={report.status} />
                      </div>
                      <div className='artist over pl-2'>
                        <div className='font-short-regular font-weight-bold'>
                          <span className='ellipsis one-line'>
                            {report.type.name}
                          </span>
                        </div>
                        <div className='d-flex align-items-center'>
                          <div className='thumbnail-artist'>
                            <div className='img-wrapper'>
                              <img
                                className='img'
                                src={
                                  artist.thumbnail
                                    ? artist.thumbnail
                                    : Placeholder
                                }
                              />
                            </div>
                          </div>
                          <span className='pl-1 font-short-s ellipsis one-line'>
                            {artist.displayName}
                          </span>
                        </div>
                      </div>
                      <div className='action surround content-width'>
                        <span
                          className='link link-underline underline font-short-s'
                          onClick={() => {
                            setExtra({ ...extra, selected: i });
                          }}
                        >
                          View
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {reports.total > reports.offset + reports.limit ? (
              <ButtonLoadMore onClick={handleLoadMore}>
                Load more
              </ButtonLoadMore>
            ) : (
              ''
            )}
          </div>
        </section>
        <section className='report-details flex-1 boxy catalog-menu'>
          <div className='header'>
            {extra.selected < 0 ? (
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
                          : Placeholder
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
          {extra.selected < 0 ? (
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
