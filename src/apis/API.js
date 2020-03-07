import fetch from 'cross-fetch';

export const getMeSimple = (token) => {
  return fetch('http://localhost:8080/me/simple', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  });
};
