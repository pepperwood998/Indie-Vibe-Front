import React, { useEffect, useRef, useState } from 'react';

function TemplateBannerPage({ title = '', bannerBg = '', body = '' }) {
  const [topFilling, setTopFilling] = useState(100);
  const [topSpacing, setTopSpacing] = useState(0);
  const headerRef = useRef();

  useEffect(() => {
    setTopSpacing(headerRef.current.getBoundingClientRect().height);
  }, []);

  const handleScroll = e => {
    let scrollTop = e.target.scrollTop;
    let ratio = Math.min(scrollTop / 100, 0.9);
    setTopFilling((1 - ratio) * 100);
  };

  return (
    <div className='content-page fadein'>
      <section className='content-page__header' ref={headerRef}>
        <div
          className='banner-wrapper'
          style={{ paddingTop: topFilling + 'px' }}
        >
          <div
            className='background'
            style={{ backgroundImage: `url(${bannerBg})` }}
          ></div>
          <div className='layer'></div>
          <h3 className='font-short-extra font-weight-bold font-white m-0'>
            {title}
          </h3>
        </div>
      </section>
      <section
        className='content-page__content'
        style={{ paddingTop: topSpacing + 'px' }}
        onScroll={handleScroll}
      >
        {body}
      </section>
    </div>
  );
}

export default TemplateBannerPage;
