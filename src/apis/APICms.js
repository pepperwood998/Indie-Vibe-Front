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
