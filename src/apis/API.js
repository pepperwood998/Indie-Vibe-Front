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

export const getTrackInfo = (token, id) => {
  return fetch(`${host}/tracks/${id}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  });
};

export const getTrackStream = (token, id, start, end) => {
  return fetch(`${host}/tracks/stream/${id}`, {
    headers: {
      Range: getRangeStr(start, end),
      Authorization: 'Bearer ' + token
    }
  });
};

const getRangeStr = (start, end) => {
  return 'bytes=' + start + '-' + end;
};
