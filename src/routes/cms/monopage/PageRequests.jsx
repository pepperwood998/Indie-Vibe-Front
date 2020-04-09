import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { actionRequest, getPendingUsers } from '../../../apis/APICms';
import AvatarPlaceholder from '../../../assets/imgs/avatar-placeholder.jpg';
import { ButtonLoadMore } from '../../../components/buttons';
import { AuthContext, LibraryContext } from '../../../contexts';

function Requests(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({
    items: [],
    offset: 0,
    limit: 0,
    total: 0
  });

  useEffect(() => {
    getPendingUsers(authState.token)
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success') {
          setData({ ...data, ...res.data });
        } else {
          throw 'Error';
        }
      })
      .catch(err => {
        console.error(err);
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

  return firstRender ? (
    ''
  ) : (
    <div className='mono-page-wrapper'>
      <div className='mono-page page-requests fadein'>
        <section className='requests-box'>
          <div className='banner'>
            <span className='title font-short-semi font-weight-bold font-white'>
              User with pending artist request
            </span>
          </div>
          <div className='content'>
            {data.total <= 0 ? (
              <span className='empty-text'>No pending artist requests</span>
            ) : (
              <ul className='requests-table'>
                {data.items.map((item, index) => (
                  <li className='requests-table__row' key={index}>
                    <div className='requests-table__cell index'>
                      {index + 1}
                    </div>
                    <div className='requests-table__cell thumbnail'>
                      <div className='thumbnail__img'>
                        <div className='img-wrapper'>
                          <img
                            className='img'
                            src={
                              item.thumbnail
                                ? item.thumbnail
                                : AvatarPlaceholder
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className='requests-table__cell name'>
                      <NavLink
                        to={`/cms/request/${item.id}`}
                        className='link ellipsis one-line'
                      >
                        {item.displayName}
                      </NavLink>
                    </div>
                    <div className='requests-table__cell action'>
                      <div
                        className='btn-quick approve'
                        onClick={() => {
                          handleAction('approve', item.id);
                        }}
                      >
                        APPROVE
                      </div>
                      <div
                        className='btn-quick deny'
                        onClick={() => {
                          handleAction('deny', item.id);
                        }}
                      >
                        DENY
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {data.total > data.offset + data.limit ? (
            <div className='load-more-wrapper text-center'>
              <ButtonLoadMore onClick={handleLoadMore}>
                Load more
              </ButtonLoadMore>
            </div>
          ) : (
            ''
          )}
        </section>
      </div>
    </div>
  );
}

export default Requests;
