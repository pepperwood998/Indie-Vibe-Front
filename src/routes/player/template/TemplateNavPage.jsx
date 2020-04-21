import React, { useEffect, useRef, useState } from 'react';

function TemplateNavPage({
  header = '',
  nav = '',
  body = '',
  className = '',
  handleScrollOver = scrolled => undefined
}) {
  const [paddingTop, setPaddingTop] = useState(0);
  const headerRef = useRef();

  useEffect(() => {
    setPaddingTop(headerRef.current.getBoundingClientRect().height);
  }, []);

  let classes = 'content-page';
  if (className) {
    classes += ` ${className}`;
  }

  const handleScroll = e => {
    if (e.target.scrollTop >= 50) {
      handleScrollOver(true);
    } else {
      handleScrollOver(false);
    }
  };

  return (
    <div className={classes}>
      <div className='content-page__header' ref={headerRef}>
        {header}
        {nav}
      </div>
      <div
        className='content-page__content'
        style={{ paddingTop: paddingTop + 'px' }}
        onScroll={handleScroll}
      >
        {body}
      </div>
    </div>
  );
}

export default TemplateNavPage;
