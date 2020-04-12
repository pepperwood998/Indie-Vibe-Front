import React, { useContext } from 'react';
import cell6 from '../../assets/imgs/ca-hoi-hoang.jpg';
import cell4 from '../../assets/imgs/kenny-g.jpg';
import LandingIntro from '../../assets/imgs/landing-intro.png';
import cell3 from '../../assets/imgs/le-cat-trong-ly.jpg';
import cell5 from '../../assets/imgs/thinh-suy.jpg';
import cell1 from '../../assets/imgs/trang.jpg';
import cell2 from '../../assets/imgs/vu.jpg';
import { ButtonFrame, ButtonMain } from '../../components/buttons';
import { AuthContext, MeContext } from '../../contexts';
import Landing from './Landing';

function Home() {
  const { state } = useContext(AuthContext);
  const { role } = useContext(MeContext).state;

  const showroom = [
    { id: '9IwDw6tHJMAR90UGvy0o', img: cell1, artist: 'Trang' },
    { id: 'a98db973kwl8xp1lz94k', img: cell2, artist: 'Vũ.' },
    { id: '9s2vQcIMmojuYEbg1Swu', img: cell3, artist: 'Lê Cát Trọng Lý' },
    { id: 'R50A4EG8FRYEyHashx2h', img: cell4, artist: 'Kenny G' },
    { id: 'WqyU666INm0dwM3kp06A', img: cell5, artist: 'Thịnh Suy' },
    { id: 'ZsGjTZQUOOjizOwk2KTQ', img: cell6, artist: 'Cá Hồi Hoang' }
  ];

  const intro = (
    <div className='content'>
      <div className='intro-body'>
        <div className='intro-thumbnail'>
          <div className='dummy'></div>
          <img src={LandingIntro} />
        </div>
        <div className='intro-text'>
          <div className='info'>
            {!state.token || role.id === 'r-free' ? (
              <p className='font-banner font-weight-bold font-white'>
                Vibe your music freedom
              </p>
            ) : (
              <p className='font-banner font-weight-bold font-white'>
                Enjoy you premium access.
              </p>
            )}
            {!state.token ? (
              <span className='font-short-big font-white'>
                Sign in to explore our collections. No credit card required.
              </span>
            ) : role.id === 'r-free' ? (
              <span className='font-short-big font-white'>
                Upgrade to premium to have full access.
              </span>
            ) : (
              ''
            )}
          </div>
          <div className='d-flex flex-column w-25'>
            {!state.token ? (
              <a href='/register'>
                <ButtonMain>Join free</ButtonMain>
              </a>
            ) : (
              <React.Fragment>
                {role.id === 'r-free' ? (
                  <div className='pb-3'>
                    <a href='/premium'>
                      <ButtonMain full>Go Premium</ButtonMain>
                    </a>
                  </div>
                ) : (
                  ''
                )}
                <div>
                  <a href='/player/home'>
                    <ButtonFrame full>Player</ButtonFrame>
                  </a>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const body = (
    <div className='content'>
      <div className='body-home'>
        <section className='banner'>
          <div className='info'>
            <h4 className='title font-banner font-weight-bold font-white'>
              Lost in our library.
            </h4>
            <p className='desc font-short-semi font-white'>
              Million of songs ready to be discovered, endless browsing
              experience with the chance of becoming an Artist yourself.
            </p>
          </div>
          {state.token ? (
            ''
          ) : (
            <div className='action'>
              <a href='/register'>
                <ButtonFrame>Sign up</ButtonFrame>
              </a>
            </div>
          )}
        </section>
        <section className='showroom custom-grid three-cols'>
          {showroom.map((item, index) => (
            <div className='item' key={index}>
              <a href={`/player/artist/${item.id}`}>
                <div className='layer'>
                  <span className='font-short-extra font-weight-bold font-white'>
                    {item.artist}
                  </span>
                </div>
              </a>
              <img className='img' src={item.img} />
            </div>
          ))}
        </section>
      </div>
    </div>
  );

  return <Landing intro={intro} body={body} active='home' />;
}

export default Home;
