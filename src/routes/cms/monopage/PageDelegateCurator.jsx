import React, { useContext, useState } from 'react';
import { delegateCurator, searchSimpleUsers } from '../../../apis/APICms';
import AvatarPlaceholder from '../../../assets/imgs/avatar-placeholder.jpg';
import { ButtonLoadMore } from '../../../components/buttons';
import { CardError } from '../../../components/cards';
import { AuthContext, LibraryContext } from '../../../contexts';
import { ButtonRegular } from '../components/buttons';
import { InputTextRegular } from '../components/inputs';

function DelegateCurator(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const [data, setData] = useState({
    displayName: ''
  });
  const [status, setStatus] = useState({
    submitted: false,
    formErr: false,
    submitErr: ''
  });
  const [users, setUsers] = useState({
    items: [],
    offset: 0,
    limit: 0,
    total: 0
  });

  const handleChangeData = e => {
    setData({
      ...data,
      [e.target.getAttribute('name')]: e.target.value
    });
  };

  const handleSearch = e => {
    e.preventDefault();
    if (!data.displayName) {
      setStatus({ ...status, formErr: true });
      return;
    }

    setStatus({ ...status, submitted: true, submitErr: '' });
    searchSimpleUsers(authState.token, data.displayName)
      .then(res => {
        setStatus({ ...status, submitted: false });
        if (res.status === 'success' && res.data) {
          setUsers({ ...users, ...res.data });
        } else {
          throw res.data;
        }
      })
      .catch(err => {
        setStatus({ ...status, submitted: false });
        if (typeof err !== 'string') {
          err = 'Server error';
        }

        setStatus({ ...status, submitErr: err });
      });
  };

  const handleLoadMore = () => {
    searchSimpleUsers(
      authState.token,
      data.displayName,
      users.offset + users.limit
    )
      .then(res => {
        if (res.status === 'success' && res.data) {
          const newUsers = res.data;
          setUsers({
            items: [...users.items, ...newUsers.items],
            offset: newUsers.offset,
            limit: newUsers.limit,
            total: newUsers.total
          });
        } else {
          throw res.data;
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleDelegate = userId => {
    delegateCurator(authState.token, userId)
      .then(res => {
        if (res.status === 'success') {
          libDispatch(
            libActions.setNotification(true, true, 'Delegate successfully')
          );

          const items = [...users.items];
          let found = items.some(user => {
            if (userId === user.id) {
              user.delegated = true;
              return true;
            }
          });

          if (found) {
            setUsers({ ...users, items: [...items] });
          }
        } else {
          throw res.data;
        }
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Server error';
        }

        libDispatch(
          libActions.setNotification(true, false, 'Failed to delegate')
        );
      });
  };

  return (
    <div className='mono-page-wrapper'>
      <div className='mono-page page-delegate-curator fadein'>
        <section className='input-box boxy catalog-menu'>
          <div className='header'>
            <span className='font-short-big'>Search for simple users</span>
          </div>
          <div className='content'>
            <form onSubmit={handleSearch}>
              {status.submitErr ? <CardError message={status.submitErr} /> : ''}

              <InputTextRegular
                name='displayName'
                placeholder='Enter display name'
                value={data.displayName}
                onChange={handleChangeData}
                error={status.formErr && data.displayName === ''}
                errMessage='Enter display name to search'
              />
              <ButtonRegular
                className='float-right mt-2'
                type='submit'
                disabled={status.submitted}
              >
                Search
              </ButtonRegular>
            </form>
          </div>
        </section>
        <section className='result-box boxy catalog-menu'>
          <div className='header'>
            <span className='font-short-big font-weight-bold'>
              List of simple users
            </span>
          </div>
          <div className='content'>
            {users.total > 0 ? (
              <ul className='requests-table'>
                {users.items.map((item, index) => (
                  <li className='requests-table__row fadein' key={index}>
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
                      <span className='ellipsis one-line'>
                        {item.displayName}
                      </span>
                    </div>
                    <div className='requests-table__cell'>
                      <span className='ellipsis one-line'>
                        {item.role.id === 'r-free' ? 'Free Tier' : 'Premium'}
                      </span>
                    </div>
                    <div className='requests-table__cell action'>
                      {item.delegated ? (
                        <div className='btn-quick regular disabled'>DONE</div>
                      ) : (
                        <div
                          className='btn-quick approve'
                          onClick={() => {
                            handleDelegate(item.id);
                          }}
                        >
                          DELEGATE
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <span className='empty-text'>No users found</span>
            )}
            {users.total > users.offset + users.limit ? (
              <div className='load-more-wrapper text-center'>
                <ButtonLoadMore onClick={handleLoadMore}>
                  Load more
                </ButtonLoadMore>
              </div>
            ) : (
              ''
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DelegateCurator;
