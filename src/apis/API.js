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

export const getStreamInfo = (token, id, bitrate) => {
  return fetch(`${host}/stream/info/${bitrate}/${id}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  });
};

export const getStream = (url, start, end) => {
  return fetch(url, {
    headers: {
      Range: getRangeStr(start, end)
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

const getRangeStr = (start, end) => {
  return 'bytes=' + start + '-' + end;
};
