import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getPendingUsers } from '../../../apis/APICms';
import AvatarPlaceholder from '../../../assets/imgs/avatar-placeholder.jpg';
import { AuthContext } from '../../../contexts';

function Requests(props) {
  const { state: authState } = useContext(AuthContext);

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
                  <li className='requests-table__row'>
                    <div className='requests-table__cell index'>
                      {index + 1}
                    </div>
                    <div className='requests-table__cell thumbnail'>
                      <div className='img-wrapper'>
                        <img
                          className='img'
                          src={
                            item.thumbnail ? item.thumbnail : AvatarPlaceholder
                          }
                        />
                      </div>
                    </div>
                    <div className='requests-table__cell name'>
                      <NavLink
                        to='/cms/request/1092is0u1s9021u'
                        className='link ellipsis one-line'
                      >
                        {item.displayName}
                      </NavLink>
                    </div>
                    <div className='requests-table__cell action'>
                      <div className='btn-quick accept'>ACCEPT</div>
                      <div className='btn-quick deny'>DENY</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Requests;
