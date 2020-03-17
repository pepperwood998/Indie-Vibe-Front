import fetch from 'cross-fetch';

import { host } from './constant';

export const getMeSimple = token => {
  return fetch(`${host}/me/simple`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  });
};

export const getGenresList = token => {
  return fetch(`${host}/genres`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  });
};

export const getReleaseTypeList = token => {
  return fetch(`${host}/release-types`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  });
};

export const publishRelease = (token, info, thumbnail, audioFiles) => {
  let data = new FormData();
  data.append('info', JSON.stringify(info));
  data.append('thumbnail', thumbnail);

  audioFiles.forEach(item => {
    data.append('audioFiles', item.audio128);
    data.append('audioFiles', item.audio320);
  });

  return fetch(`${host}/artist/releases`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: data
  });
};

export const createPlaylist = (token, title, description, thumbnail) => {
  let data = new FormData();
  data.append('title', title);
  if (description) data.append('description', description);
  if (thumbnail) data.append('thumbnail', thumbnail);

  return fetch(`${host}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: data
  });
};

export const performActionFavorite = (token, type, id, relation, action) => {
  if (type === 'profile' || type === 'artist') {
    type = 'user';
  }
  let url = `${host}/${type}s/${id}`;

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: `action=${action}`
  })
    .then(response => response.json())
    .then(res => {
      if (res.status === 'success') {
        if (action === 'favorite') return [...relation, 'favorite'];
        else return relation.filter(value => value !== 'favorite');
      } else {
        throw 'Error';
      }
    });
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

export const profile = (token, userId) => {
  let url = `${host}/library/${userId}/profile`;

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getPlaylistsMe = (token, offset = 0, limit = 20) => {
  let url = new URL(`${host}/me/playlists`);
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
