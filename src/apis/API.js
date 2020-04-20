import axios from 'axios';
import fetch from 'cross-fetch';
import { host } from './constant';

export const getGenresList = token => {
  return fetch(`${host}/genres`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getReleaseTypeList = token => {
  return fetch(`${host}/release-types`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getReportTypeList = token => {
  return fetch(`${host}/report-types`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const publishRelease = (
  token,
  info,
  thumbnail,
  audioFiles,
  biography = '',
  baa = false,
  onProgress = per => undefined
) => {
  let url = `${host}/releases`;
  if (baa) url = `${host}/account/baa`;

  let formData = new FormData();
  formData.append('info', JSON.stringify(info));
  formData.append('thumbnail', thumbnail);

  audioFiles.forEach(item => {
    formData.append('audioFiles', item.audio128);
    formData.append('audioFiles', item.audio320);
  });
  if (biography) formData.append('biography', biography);

  return axios({
    url,
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
    onUploadProgress: e => {
      onProgress((e.loaded / e.total) * 100);
    }
  }).then(response => response.data);
};

export const createOrEditPlaylist = (
  token,
  data = { title: [], description: [], thumbnail: [] },
  type = 'create',
  playlistId = ''
) => {
  let formData = new FormData();
  for (let key in data) {
    if (data[key][0]) {
      formData.append(key, data[key][1]);
    }
  }

  let url = `${host}/playlists`;
  if (type === 'edit') url += `/${playlistId}`;
  url = new URL(url);

  return fetch(url, {
    method: type === 'edit' ? 'PUT' : 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  }).then(response => response.json());
};

export const deleteTrackList = (token, type, id) => {
  let url = `${host}/${type}s/${id}`;

  return fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const performActionFavorite = (token, type, id, relation, action) => {
  return performAction(token, id, action, type).then(res => {
    if (res.status === 'success') {
      if (action === 'favorite') return [...relation, 'favorite'];
      else return relation.filter(value => value !== 'favorite');
    } else {
      throw 'Error';
    }
  });
};

export const performAction = (token, id, action, type) => {
  if (type === 'profile' || type === 'artist') {
    type = 'user';
  }
  let url = new URL(`${host}/${type}s/${id}`);
  url.search = new URLSearchParams({ action }).toString();

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const addTrackToPlaylist = (token, playlistId, trackId) => {
  let url = new URL(`${host}/playlists/${playlistId}/track`);
  url.search = new URLSearchParams({ trackId });

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const removeTrackFromPlaylist = (token, playlistId, trackId) => {
  let url = new URL(`${host}/playlists/${playlistId}/track`);
  url.search = new URLSearchParams({ trackId });

  return fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const search = (token, key, type = '', offset = 0, limit = 20) => {
  let url = `${host}/search/${key}`;
  if (type) url += `/${type}s`;

  url = new URL(url);
  url.search = new URLSearchParams({ offset, limit }).toString();

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const library = (token, userId, type = '', offset = 0, limit = 20) => {
  let url = `${host}/library/${userId}`;
  if (type) {
    url += `/${type}s`;
    if (type !== 'artist' && type !== 'following' && type !== 'follower') {
      url += '/favorite';
    }
  }

  url = new URL(url);
  url.search = new URLSearchParams({ offset, limit }).toString();

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getProfile = (token, userId) => {
  let url = `${host}/library/${userId}/profile`;

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getArtist = (token, artistId) => {
  let url = new URL(`${host}/artists/${artistId}`);

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getPlaylistsMeOwn = (token, offset = 0, limit = 20) => {
  return getPlaylists(token, '', '', 'own', offset, limit);
};

export const getPlaylistsMeFav = (token, offset = 0, limit = 20) => {
  return getPlaylists(token, '', '', 'favorite', offset, limit);
};

export const getPlaylists = (
  token,
  fromId,
  targetId,
  relation = 'own',
  offset = 0,
  limit = 20
) => {
  let urlStr = '';
  if (fromId === targetId) {
    urlStr = `${host}/library/playlists/${relation}`;
  } else {
    urlStr = `${host}/library/${targetId}/playlists/${relation}`;
  }
  let url = new URL(urlStr);
  url.search = new URLSearchParams({ offset, limit }).toString();

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getPlaylistSimple = (token, playlistId) => {
  return fetch(`${host}/playlists/simple/${playlistId}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getTrackFull = (token, id) => {
  let url = new URL(`${host}/tracks/${id}`);

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getTrackList = (token, id, type, offset = 0, limit = 20) => {
  let url = new URL(`${host}/${type}s/full/${id}`);
  url.search = new URLSearchParams({ offset, limit }).toString();

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getReleasesByType = (
  token,
  artistId,
  type = 're-album',
  offset = 0,
  limit = 20
) => {
  let url = new URL(`${host}/artists/${artistId}/releases/${type}`);
  url.search = new URLSearchParams({ offset, limit }).toString();

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getAccount = token => {
  let url = new URL(`${host}/account`);

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const updateAccount = (token, data) => {
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

  let url = new URL(`${host}/account`);
  return fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  }).then(response => response.json());
};

export const updatePassword = (token, data) => {
  let formData = new FormData();
  for (let key in data) {
    if (data[key]) {
      formData.append(key, data[key]);
    }
  }

  let url = new URL(`${host}/account/password`);
  return fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  }).then(response => response.json());
};

export const browseGeneral = token => {
  let url = new URL(`${host}/browse/general`);

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const browseReleases = token => {
  let url = new URL(`${host}/browse/releases`);

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const browseGenre = (token, id) => {
  let url = new URL(`${host}/browse/genres/${id}`);

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const browseGenreType = (token, id, type, offset = 0, limit = 20) => {
  let url = new URL(`${host}/browse/genres/${id}/${type}`);
  url.search = new URLSearchParams({ offset, limit });

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const purchase = (token, type, stripeToken, packageType) => {
  if (type === 'monthly') {
    return purchaseMonthly(token, stripeToken);
  } else {
    return purchaseFixed(token, stripeToken, packageType);
  }
};

const purchaseMonthly = (token, stripeToken) => {
  let url = new URL(`${host}/purchase/monthly`);
  let formData = new FormData();
  formData.append('stripeToken', stripeToken);

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  }).then(response => response.json());
};
const purchaseFixed = (token, stripeToken, packageType) => {
  let url = new URL(`${host}/purchase/fixed/${packageType}`);
  let formData = new FormData();
  formData.append('stripeToken', stripeToken);

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  }).then(response => response.json());
};

export const streamCount = (token, type, id) => {
  let url = new URL(`${host}/stream/count/${type}/${id}`);

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getHome = token => {
  let url = new URL(`${host}/home`);

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getTrackSimple = (token, id) => {
  let url = new URL(`${host}/tracks/simple/${id}`);

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const cancelSubscription = token => {
  let url = new URL(`${host}/account/cancel`);

  return fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const reportArtist = (token, id, data) => {
  let url = new URL(`${host}/report/${id}`);
  let formData = new FormData();
  for (let key in data) {
    formData.append(key, data[key]);
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  }).then(response => response.json());
};
