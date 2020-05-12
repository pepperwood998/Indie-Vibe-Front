import React from 'react';
import cell6 from '../../assets/imgs/ca-hoi-hoang.jpg';
import cell7 from '../../assets/imgs/chillies.jpg';
import cell4 from '../../assets/imgs/kenny-g.jpg';
import cell3 from '../../assets/imgs/le-cat-trong-ly.jpg';
import cell5 from '../../assets/imgs/thinh-suy.jpg';
import cell1 from '../../assets/imgs/trang.jpg';
import cell8 from '../../assets/imgs/vu-cat-tuong.jpg';
import cell2 from '../../assets/imgs/vu.jpg';
import { ButtonFrame, ButtonMain } from '../../components/buttons';
import Landing from './Landing';

function About() {
  const showroom = [
    { id: '9IwDw6tHJMAR90UGvy0o', img: cell1, artist: 'Trang' },
    { id: 'a98db973kwl8xp1lz94k', img: cell2, artist: 'Vũ.' },
    { id: '9s2vQcIMmojuYEbg1Swu', img: cell3, artist: 'Lê Cát Trọng Lý' },
    { id: 'R50A4EG8FRYEyHashx2h', img: cell4, artist: 'Kenny G' },
    { id: 'WqyU666INm0dwM3kp06A', img: cell5, artist: 'Thịnh Suy' },
    { id: 'ZsGjTZQUOOjizOwk2KTQ', img: cell6, artist: 'Cá Hồi Hoang' },
    { id: 'lfXzWs6rY1KJk8kchgu1', img: cell8, artist: 'Vũ Cát Tường' },
    { id: 'QX8FKr4s2dlH3V0xk5df', img: cell7, artist: 'Chillies.' }
  ];

  const intro = (
    <div className='content'>
      <section>
        <p className='font-banner font-weight-bold font-white m-0'>
          Vibe your music freedom.
        </p>
        <p className='font-banner font-weight-bold font-white'>
          Never skip a beat.
        </p>
      </section>
      <section>
        <p className='font-short-semi font-white'>Start your journey now.</p>
        <a href='/register'>
          <ButtonMain>Sign up</ButtonMain>
        </a>
      </section>
    </div>
  );
  const body = (
    <div className='content text-center'>
      <section className='pb-5'>
        <p className='font-short-extra font-weight-bold font-white'>
          Stream your choices at will.
        </p>
      </section>
      <section className='showroom custom-grid four-cols about'>
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
  );
  const extra = [
    <div className='extra__quality side-by-side side-space over-space' key='quality'>
      <div className='background'></div>
      <div className='layer'></div>
      <section className='text'>
        <p className='font-short-extra font-weight-bold font-white'>
          Choose your streaming quality
        </p>
        <p>
          <ButtonFrame className='mr-3'>128kbps</ButtonFrame>
          <ButtonMain>320kbps</ButtonMain>
        </p>
        <p className='font-short-semi font-white'>
          We provide multiple quality range to adapt to your desired music
          streaming needs.
        </p>
      </section>
      <section></section>
    </div>,
    <div className='extra__baa side-by-side side-space over-space' key='baa'>
      <div className='background'></div>
      <div className='layer'></div>
      <section></section>
      <section className='text'>
        <p className='font-short-extra font-weight-bold font-white'>
          Become your own Artist
        </p>
        <p className='font-short-semi font-white'>
          Want to share your music with the world, subscribe to our premium,
          publish your content and manage your music workspace.
        </p>
      </section>
    </div>,
    <div className='extra__wrapup side-space over-space text-center' key='wrapup'>
      <p className='font-short-extra font-weight-bold font-white'>
        What are you waiting for?
      </p>
      <p className='font-short-semi font-white'>Join us now.</p>
      <a href='/register'>
        <ButtonMain>Sign up</ButtonMain>
      </a>
    </div>
  ];

  return (
    <Landing
      intro={intro}
      body={body}
      extra={extra}
      active='about'
      short
      introClear
    />
  );
}

export default About;
