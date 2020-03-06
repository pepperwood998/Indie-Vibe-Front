import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

function ButtonFacebook(props) {
  let classes = [
    'button button-fb font-white font-short-regular font-weight-bold',
    props.className
  ].join(' ');
  if (props.isFitted) {
    classes += ' button--fit';
  }
  if (props.disabled) {
    classes += ' disabled';
  }

  return (
    <FacebookLogin
      appId='130595185046801'
      fields='name,email,picture'
      callback={props.responseFacebook}
      render={renderProps => (
        <div
          className={classes}
          onClick={() => {
            if (props.onClick) props.onClick();
            renderProps.onClick();
          }}
        >
          {props.children}
        </div>
      )}
    />
  );
}

export default ButtonFacebook;
