import fetch from 'cross-fetch';
import { host } from './constant';

export const login = (email, password) => {
  return fetch(`${host}/login`, {
    method: 'POST',
    body: `email=${email}&password=${password}`,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  }).then(response => response.json());
};

export const loginFb = (id, token) => {
  return fetch(`${host}/login/facebook`, {
    method: 'POST',
    body: `userFbId=${id}&userFbToken=${token}`,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  }).then(response => response.json());
};

export const register = (email, password, cfPassword, displayName, gender) => {
  return fetch(`${host}/register`, {
    method: 'POST',
    body: `email=${email}&password=${password}&cfPassword=${cfPassword}&displayName=${displayName}&gender=${gender}`,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  });
};

export const registerWithFb = (
  email,
  displayName,
  thumbnail,
  fbId,
  fbToken
) => {
  return fetch(`${host}/register/facebook`, {
    method: 'POST',
    body: `email=${email}&displayName=${displayName}&thumbnail=${thumbnail}&fbId=${fbId}&fbToken=${fbToken}`,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  });
};

export const getNewToken = token => {
  return fetch(`${host}/token`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    }
  });
};

export const getFbPictureUrl = fbId => {
  return fetch(
    `https://graph.facebook.com/${fbId}/picture?type=square&redirect=false`
  );
};

export const resetActivationLink = email => {
  let url = new URL(`${host}/reset`);
  let formData = new FormData();
  formData.append('email', email);

  return fetch(url, {
    method: 'POST',
    body: formData
  }).then(response => response.json());
};

export const activate = (id, activateToken) => {
  let url = new URL(`${host}/activate`);
  let formData = new FormData();
  formData.append('id', id);
  formData.append('activateToken', activateToken);

  return fetch(url, {
    method: 'POST',
    body: formData
  }).then(response => response.json());
};
