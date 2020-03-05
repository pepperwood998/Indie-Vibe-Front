import fetch from 'cross-fetch';

export const login = (email, password) => {
  return fetch('http://localhost:8080/login', {
    method: 'POST',
    body: `email=${email}&password=${password}`,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  });
};

export const register = (email, password, cfPassword, displayName, gender) => {
  return fetch('http://localhost:8080/register', {
    method: 'POST',
    body: `email=${email}&password=${password}&cfPassword=${cfPassword}&displayName=${displayName}&gender=${gender}`,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  });
};
