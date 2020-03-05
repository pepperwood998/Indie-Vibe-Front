import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

function ButtonFacebook({
  label = 'Enter',
  isFitted = true,
  responseFacebook = response => {}
}) {
  let classes = 'button button-fb font-white font-regular';
  if (isFitted) {
    classes += ' button--fit';
  }

  return (
    <FacebookLogin
      appId='130595185046801'
      fields='name,email,picture'
      callback={responseFacebook}
      render={renderProps => (
        <div className={classes} onClick={renderProps.onClick}>
          {label}
        </div>
      )}
    />
  );
}

export default ButtonFacebook;
