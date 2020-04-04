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

export const getPendingRelease = (token, userId, offset = 0, limit = 20) => {
  let url = new URL(`${host}/cms/request/${userId}`);
  url.search = new URLSearchParams({ offset, limit });

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const actionRequest = (token, userId, action) => {
  let url = new URL(`${host}/cms/request/${userId}`);
  let formData = new FormData();
  formData.append('action', action);

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  }).then(response => response.json());
};

export const searchSimpleUsers = (
  token,
  displayName,
  offset = 0,
  limit = 20
) => {
  let url = new URL(`${host}/cms/profiles/${displayName}`);
  url.search = new URLSearchParams({ offset, limit });

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const delegateCurator = (token, userId) => {
  let url = new URL(`${host}/cms/delegate`);
  let formData = new FormData();
  formData.append('userId', userId);

  return fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  }).then(response => response.json());
};
