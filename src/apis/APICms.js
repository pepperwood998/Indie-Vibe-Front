import { host } from './constant';

export const cmsLogin = (username, password) => {
  let url = new URL(`${host}/login-cms`);
  let formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  return fetch(url, {
    method: 'POST',
    body: formData
  }).then(response => response.json());
};

export const getPendingUsers = (token, offset = 0, limit = 20) => {
  let url = new URL(`${host}/cms/requests`);
  url.search = new URLSearchParams({ offset, limit });

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getPendingRelease = (token, userId, offset, limit) => {
  let url = new URL(`${host}/cms/requests/${userId}`);
  url.search = new URLSearchParams({ offset, limit });

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const actionRequest = (token, userId, action) => {
  let url = new URL(`${host}/cms/requests/${userId}`);
  let formData = new FormData();
  formData.append('action', action);

  return fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  }).then(response => response.json());
};

export const createCurator = (token, displayName) => {
  let url = new URL(`${host}/cms/curator`);
  let formData = new FormData();
  formData.append('displayName', displayName);

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  }).then(response => response.json());
};
