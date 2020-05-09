import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { actionRequest, getPendingUsers } from '../../../../apis/APICms';
import AvatarPlaceholder from '../../../../assets/imgs/avatar-placeholder.jpg';
import { ButtonLoadMore } from '../../../../components/buttons';
import { AuthContext, LibraryContext } from '../../../../contexts';
import { model, genOneValueArr } from '../../../../utils/Common';
import ButtonQuick from '../buttons/ButtonQuick';

function TableArtistRequests({ withActions = false }) {
  const { state: authState } = useContext(AuthContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  const [status, setStatus] = useState({
    firstRender: true
  });
  const [data, setData] = useState({ ...model.paging });
  const [updating, setUpdating] = useState([]);

  useEffect(() => {
    getPendingUsers(authState.token)
      .then(res => {
        setStatus({ ...status, firstRender: false });
        if (res.status === 'success') {
          const value = { ...res.data } || { ...model.paging };
          setData({ ...data, ...value });
          setUpdating(genOneValueArr(value.total, 0));
        } else throw res.data;
      })
      .catch(err => {
        setStatus({ ...status, firstRender: false });
        if (typeof err !== 'string') {
          err = 'Server error';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
  }, []);

  const handleAction = (action, userId, index) => {
    setUpdating(last => {
      const lastTmp = [...last];
      lastTmp[index] = 1;
      return lastTmp;
    });

    actionRequest(authState.token, userId, action)
      .then(res => {
        if (res.status === 'success') {
          setUpdating(last => {
            const lastTmp = [...last];
            lastTmp[index] = 2;
            return lastTmp;
          });

          switch (action) {
            case 'approve':
              libDispatch(
                libActions.setNotification(true, true, 'Request accepted')
              );
              break;
            case 'deny':
              libDispatch(
                libActions.setNotification(true, true, 'Request rejected.')
              );
              break;
            default:
              libDispatch(
                libActions.setNotification(true, false, 'Action not found.')
              );
          }
        } else {
          throw 'Failed to perform verify action.';
        }
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Server error';
        }

        setUpdating(last => {
          const lastTmp = [...last];
          lastTmp[index] = 0;
          return lastTmp;
        });
        libDispatch(libActions.setNotification(true, false, err));
      });
  };

  const handleLoadMore = () => {
    getPendingUsers(authState.token, data.offset + data.limit)
      .then(res => {
        if (res.status === 'success' && res.data) {
          const requests = res.data;
          setData({
            items: [...data.items, ...requests.items],
            offset: requests.offset,
            limit: requests.limit,
            total: requests.total
          });
          setUpdating(last => [
            ...last,
            ...genOneValueArr(requests.total, 0)
          ]);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  return status.firstRender ? (
    ''
  ) : (
    <div className='artist-requests-table'>
      {data.total <= 0 ? (
        <span className='empty-text p-3'>No pending artist requests</span>
      ) : (
        <ul className='artist-requests table-layout table-layout--collapse'>
          {data.items.map((item, index) => (
            <li className='table-row' key={index}>
              <div className='serial center side content-width'>
                <span>{index + 1}</span>
              </div>
              <div className='thumbnail content-width cover'>
                <div className='thumbnail__container'>
                  <div className='img-wrapper'>
                    <img
                      className='img'
                      src={item.thumbnail ? item.thumbnail : AvatarPlaceholder}
                    />
                  </div>
                </div>
              </div>
              <div className='name full'>
                <NavLink
                  to={`/cms/request/${item.id}`}
                  className='link ellipsis one-line'
                >
                  {item.displayName}
                </NavLink>
              </div>
              {withActions ? (
                <div className='actions side'>
                  <div className='d-flex align-items-center justify-content-end'>
                    {updating[index] === 0 ? (
                      <React.Fragment>
                        <ButtonQuick
                          type='approve'
                          onClick={() => {
                            handleAction('approve', item.id, index);
                          }}
                          className='mr-1'
                        >
                          APPROVE
                        </ButtonQuick>
                        <ButtonQuick
                          type='deny'
                          onClick={() => {
                            handleAction('deny', item.id, index);
                          }}
                        >
                          DENY
                        </ButtonQuick>
                      </React.Fragment>
                    ) : updating[index] === 1 ? (
                      <ButtonQuick disabled>processing</ButtonQuick>
                    ) : (
                      <ButtonQuick disabled>DONE</ButtonQuick>
                    )}
                  </div>
                </div>
              ) : (
                ''
              )}
            </li>
          ))}
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

export default TableArtistRequests;
