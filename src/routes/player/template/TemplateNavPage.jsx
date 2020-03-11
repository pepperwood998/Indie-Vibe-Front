import React from 'react';

function TemplateNavPage(props) {
  let classes = ['content-page compound-page', props.className].join(' ');

  return (
    <div className={classes}>
      {props.header}
      {props.nav}
      <div className='body-scroll'>
        <div className='body'>{props.body}</div>
      </div>
    </div>
  );
}

export default TemplateNavPage;
