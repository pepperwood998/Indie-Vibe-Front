import fetch from 'cross-fetch';

export const login = (email, password) => {
  return fetch('http://localhost:8080/login', {
    method: 'POST',
    body: `email=${email}&password=${password}`,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  });
};
