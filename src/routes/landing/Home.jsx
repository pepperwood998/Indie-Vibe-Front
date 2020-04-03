import React, { useContext } from 'react';
import cell1 from '../../assets/imgs/cell-1.png';
import cell2 from '../../assets/imgs/cell-2.png';
import cell3 from '../../assets/imgs/cell-3.png';
import cell4 from '../../assets/imgs/cell-4.png';
import cell5 from '../../assets/imgs/cell-5.png';
import cell6 from '../../assets/imgs/cell-6.png';
import LandingIntro from '../../assets/imgs/landing-intro.png';
import { ButtonFrame, ButtonMain } from '../../components/buttons';
import { AuthContext } from '../../contexts';
import Landing from './Landing';

function Home() {
  const { state } = useContext(AuthContext);

  const showroom = [
    { href: '#', img: cell1, artist: 'Kodaline' },
    { href: '#', img: cell2, artist: 'Tessa Violet' },
    { href: '#', img: cell3, artist: 'Doedie' },
    { href: '#', img: cell4, artist: 'Ed Sheeran' },
    { href: '#', img: cell5, artist: 'Ngọt.' },
    { href: '#', img: cell6, artist: 'Cá Hồi Hoang' }
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
            {!state.token || state.role === 'r-free' ? (
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
            ) : state.role === 'r-free' ? (
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
                <ButtonMain isFitted={true}>Join free</ButtonMain>
              </a>
            ) : (
              <React.Fragment>
                {state.role === 'r-free' ? (
                  <div className='pb-3'>
                    <a href='/premium'>
                      <ButtonMain>Go Premium</ButtonMain>
                    </a>
                  </div>
                ) : (
                  ''
                )}
                <div>
                  <a href='/player/home'>
                    <ButtonFrame>Player</ButtonFrame>
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
                <ButtonFrame isFitted={true}>Sign up</ButtonFrame>
              </a>
            </div>
          )}
        </section>
        <section className='showroom custom-grid three-cols'>
          {showroom.map((item, index) => (
            <div className='item' key={index}>
              <a href={item.href}>
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
