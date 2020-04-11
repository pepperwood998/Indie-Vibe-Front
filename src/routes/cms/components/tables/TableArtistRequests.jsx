import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { actionRequest, getPendingUsers } from '../../../../apis/APICms';
import AvatarPlaceholder from '../../../../assets/imgs/avatar-placeholder.jpg';
import { ButtonLoadMore } from '../../../../components/buttons';
import { AuthContext, LibraryContext } from '../../../../contexts';
import { model } from '../../../../utils/Common';
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

  useEffect(() => {
    getPendingUsers(authState.token)
      .then(res => {
        setStatus({ ...status, firstRender: false });
        if (res.status === 'success') {
          setData({ ...data, ...res.data });
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

  const handleAction = (action, userId) => {
    actionRequest(authState.token, userId, action)
      .then(res => {
        if (res.status === 'success') {
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

          setData({
            ...data,
            items: data.items.filter(item => userId !== item.id),
            total: data.total - 1
          });
        } else {
          throw 'Failed to perform verify action.';
        }
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Server error';
        }

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
                  <div className='d-flex align-items-center'>
                    <ButtonQuick
                      type='approve'
                      onClick={() => {
                        handleAction('approve', item.id);
                      }}
                      className='mr-1'
                    >
                      APPROVE
                    </ButtonQuick>
                    <ButtonQuick
                      type='deny'
                      onClick={() => {
                        handleAction('deny', item.id);
                      }}
                    >
                      DENY
                    </ButtonQuick>
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
