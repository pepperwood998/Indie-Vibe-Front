import React from 'react';

function TemplateNavPage(props) {
  let classes = ['content-page compound-page', props.className].join(' ');
  let handleScrollOver = props.handleScrollOver
    ? props.handleScrollOver
    : () => undefined;

  const handleScroll = e => {
    if (e.target.scrollTop >= 100) {
      handleScrollOver(true);
    } else {
      handleScrollOver(false);
    }
  };

  let bodyClasses = 'body' + (props.full ? ' full' : '');
  return (
    <div className={classes}>
      {props.header}
      {props.nav}
      <div className='body-scroll' onScroll={handleScroll}>
        <div className={bodyClasses}>{props.body}</div>
      </div>
    </div>
  );
}

export default TemplateNavPage;
