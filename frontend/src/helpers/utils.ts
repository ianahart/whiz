import axios from 'axios';

export const http = axios.create({
  // Change in production
  baseURL: 'http://localhost:3000/api/v1/',
});

export const makePossesiveName = (name: string) => {
  return name
    .split(' ')
    .map((word) => word.toLowerCase())
    .join(' ');
};
export const makeFirstInitial = (name: string) => {
  return name.split(' ')[0].slice(0, 1);
};

export const retrieveTokens = () => {
  const storage = localStorage.getItem('tokens');
  let tokens;
  if (storage) {
    tokens = JSON.parse(storage);
  }
  return tokens;
};

export const namePath = (name: string) => {
  return name
    .split('')
    .filter((ch) => ch !== ' ')
    .map((ch) => ch.toLowerCase())
    .join('');
};
