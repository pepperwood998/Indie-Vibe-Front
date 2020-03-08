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

const getRangeStr = (start, end) => {
  return 'bytes=' + start + '-' + end;
};
