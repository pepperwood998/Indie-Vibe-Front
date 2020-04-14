import React, { useContext, useEffect, useState } from 'react';
import { getReports } from '../../../../apis/APICms';
import AvatarPlaceholder from '../../../../assets/imgs/avatar-placeholder.jpg';
import { ButtonLoadMore } from '../../../../components/buttons';
import { AuthContext, LibraryContext } from '../../../../contexts';
import { getDatePart, model, useEffectSkip } from '../../../../utils/Common';
import { ButtonQuick } from '../buttons';

function TableReportRequests({
  withActions = false,
  type = 'all',
  rptStatus = 'all',
  onView = report => undefined,
  onProcess = status => undefined,
  processed = {
    id: '',
    status: ''
  }
}) {
  const { state: authState } = useContext(AuthContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  const [status, setStatus] = useState({
    firstRender: true
  });
  const [data, setData] = useState({ ...model.paging });

  useEffect(() => {
    getReports(authState.token, type, rptStatus)
      .then(res => {
        setStatus({ ...status, firstRender: false });
        if (res.status === 'success' && res.data) {
          setData({ ...data, ...res.data });
        } else throw res.data;
      })
      .catch(err => {
        setStatus({ ...status, firstRender: false });
        if (typeof err !== 'string') {
          err = 'Error getting reports';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
  }, [type, rptStatus]);

  useEffectSkip(() => {
    if (processed.id) {
      const items = [...data.items];
      items.some(report => {
        if (processed.id === report.id) {
          report.status = processed.status;
          onProcess(report);
          return true;
        }
      });
      setData({ ...data, items: [...items] });
    }
  }, [processed]);

  const handleLoadMore = () => {
    getReports(authState.token, type, rptStatus, data.offset + data.limit)
      .then(res => {
        if (res.status === 'success' && res.data) {
          setData({
            ...data,
            ...res.data,
            items: [...data.items, ...res.data.items]
          });
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
      });
  };

  return status.firstRender ? (
    ''
  ) : (
    <div className='report-requests-table'>
      {data.total <= 0 ? (
        <span className='empty-text p-3'>No report artist requests</span>
      ) : (
        <ul className='report-requests table-layout table-layout--collapse mt-3'>
          {data.items.map((report, i) => {
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
                            : AvatarPlaceholder
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className='info over pl-2'>
                  <div className='font-short-big font-weight-bold ellipsis one-line'>
                    {reporter.displayName}
                  </div>
                  <div className='font-short-s'>{getDatePart(report.date)}</div>
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
                              : AvatarPlaceholder
                          }
                        />
                      </div>
                    </div>
                    <span className='pl-1 font-short-s ellipsis one-line'>
                      {artist.displayName}
                    </span>
                  </div>
                </div>
                {withActions ? (
                  <div className='action surround content-width'>
                    <span
                      className='link link-underline underline font-short-s'
                      onClick={() => {
                        onView(report);
                      }}
                    >
                      View
                    </span>
                  </div>
                ) : (
                  ''
                )}
              </li>
            );
          })}
        </ul>
      )}

      {data.total > data.offset + data.limit ? (
        <ButtonLoadMore onClick={handleLoadMore}>Load more</ButtonLoadMore>
      ) : (
        ''
      )}
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

export default TableReportRequests;
