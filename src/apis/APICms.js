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

export const delegateCurator = (token, userId, action = 'delegate') => {
  let url;
  if (action === 'delegate') url = new URL(`${host}/cms/delegate`);
  else url = new URL(`${host}/cms/undelegate`);

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

export const getRevenueYear = (token, start, end) => {
  let url = new URL(`${host}/cms/revenue/yearly`);
  url.search = new URLSearchParams({ start, end });

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getRevenueMonth = (token, year) => {
  let url = new URL(`${host}/cms/revenue/monthly`);
  url.search = new URLSearchParams({ year });

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getReports = (token, type, status, offset = 0, limit = 20) => {
  let urlStr = `${host}/cms/reports`;
  if (type && type !== 'all') urlStr += `/${type}`;

  let url = new URL(urlStr);
  url.search = new URLSearchParams({ offset, limit });

  if (status && status !== 'all') url.searchParams.append('status', status);

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const processReport = (token, id, action) => {
  let url = new URL(`${host}/cms/reports/${id}`);
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

export const getStatisticsAnnual = (token, start, end) => {
  let url = new URL(`${host}/cms/stream/yearly`);
  url.search = new URLSearchParams({ start, end });

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getStatisticsMonthly = (token, year) => {
  let url = new URL(`${host}/cms/stream/monthly`);
  url.search = new URLSearchParams({ year });

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const addGenre = (token, genre) => {
  let url = new URL(`${host}/cms/genres`);
  let formData = new FormData();
  Object.keys(genre).forEach(key => {
    if (genre[key]) formData.append(key, genre[key]);
  });

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  }).then(response => response.json());
};

export const getGenre = (token, id) => {
  let url = new URL(`${host}/cms/genres/${id}`);

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const editGenre = (
  token,
  id,
  data = { name: '', description: '', thumbnail: null }
) => {
  let url = new URL(`${host}/cms/genres/${id}`);
  let formData = new FormData();
  for (let key in data) {
    if (data[key][0]) {
      formData.append(key, data[key][1]);
    }
  }

  return fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  }).then(response => response.json());
};

export const deleteGenre = (token, id) => {
  let url = new URL(`${host}/cms/genres/${id}`);

  return fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};
