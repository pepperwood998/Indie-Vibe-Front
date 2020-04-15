import fetch from 'cross-fetch';
import { host } from './constant';

export const streamCollection = (token, type, id) => {
  let url = `${host}/stream/${type}`;
  if (type !== 'favorite') {
    url += `/${id}`;
  }

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

export const getStreamInfo = (token, id, bitrate) => {
  return fetch(`${host}/stream/info/${bitrate}/${id}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  });
};

export const getStreamQueue = (token, tracks = []) => {
  let url = new URL(`${host}/queue-detail`);
  url.search = new URLSearchParams({ tracks });

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => response.json());
};

// export const getStream = (url, start, end) => {
//   return fetch(url, {
//     headers: {
//       Range: getRangeStr(start, end)
//     }
//   });
// };

// const getRangeStr = (start, end) => {
//   return 'bytes=' + start + '-' + end;
// };
