import fetch from 'cross-fetch';
import { current } from '../utils/Common';
import { host } from './constant';

export const updateReleaseDetails = (
  token,
  id,
  data = { title: [], type: [], thumbnail: [] }
) => {
  let url = new URL(`${host}/workspace/releases/${id}`);
  let formData = new FormData();
  let changeCounter = 0;
  for (let key in data) {
    if (data[key][0]) {
      formData.append(key, data[key][1]);
      changeCounter++;
    }
  }

  if (!changeCounter)
    return new Promise((resolve, reject) => {
      resolve({ status: 'unchanged' });
    });

  return fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  }).then(response => response.json());
};

export const updateTrack = (
  token,
  id,
  data = { title: [], genres: [], producer: [], mp3128: [], mp3320: [] }
) => {
  let url = new URL(`${host}/workspace/tracks/${id}`);
  let formData = new FormData();
  let changeCounter = 0;
  for (let key in data) {
    if (data[key][0]) {
      formData.append(key, data[key][1]);
      changeCounter++;
    }
  }

  if (!changeCounter)
    return new Promise((resolve, reject) => {
      resolve({ status: 'unchanged' });
    });

  return fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  }).then(response => response.json());
};

export const deleteRelease = (token, id) => {
  let url = new URL(`${host}/workspace/releases/${id}`);

  return fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const deleteTrack = (token, id) => {
  let url = new URL(`${host}/workspace/tracks/${id}`);

  return fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const setReleasePrivacy = (token, id, action) => {
  let url = new URL(`${host}/workspace/releases/${id}`);
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

export const getStreamTotal = (
  token,
  artistId,
  year = new Date().getFullYear()
) => {
  let url = new URL(`${host}/workspace/statistics/${artistId}`);
  url.search = new URLSearchParams({ year });

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getStreamRelease = (
  token,
  artistId,
  month = current.month,
  year = current.year,
  offset = 0,
  limit = 20
) => {
  let url = new URL(`${host}/workspace/statistics/${artistId}/releases`);
  url.search = new URLSearchParams({ month, year, offset, limit });

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};
