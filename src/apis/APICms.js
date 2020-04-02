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

  return fetch('http://localhost:3001/cms-requests', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};
