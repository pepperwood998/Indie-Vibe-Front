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

export const getStream = (token, id, bitrate, start, end) => {
  return fetch(`${host}/stream/${bitrate}/${id}`, {
    headers: {
      Range: getRangeStr(start, end),
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
  data.append('audioFiles', audioFiles);

  console.log(info);
  // return fetch(`${host}/artist/releases`, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': 'Bearer ' + token,
  //     'Content-type': 'application/x-www-form-urlencoded'
  //   },
  //   body: data
  // });
};

const getRangeStr = (start, end) => {
  return 'bytes=' + start + '-' + end;
};
