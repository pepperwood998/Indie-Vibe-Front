import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

function ButtonFacebook({
  className = '',
  full = false,
  disabled = false,
  onClick = () => undefined,
  children,
  type = 'button',
  responseFacebook = () => undefined
}) {
  let classes =
    'button button-fb font-white font-short-regular font-weight-bold';
  classes += className ? ` ${className}` : '';
  classes += full ? ' full' : '';
  classes += disabled ? ' disabled' : '';

  return (
    <FacebookLogin
      appId='130595185046801'
      fields='name,email,picture'
      callback={responseFacebook}
      render={renderProps => (
        <button
          className={classes}
          onClick={() => {
            onClick();
            renderProps.onClick();
          }}
          type={type}
        >
          {children}
        </button>
      )}
    />
  );
}

export default ButtonFacebook;
