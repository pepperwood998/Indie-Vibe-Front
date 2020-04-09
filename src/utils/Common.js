import interpolate from 'color-interpolate';
import React, { useEffect, useRef } from 'react';

export const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getFormattedTime = second => {
  // Hours, minutes and seconds
  var hrs = ~~(second / 3600);
  var mins = ~~((second % 3600) / 60);
  var secs = ~~second % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;
  return ret;
};

export const getDatePart = datetime => {
  if (datetime) return /\d{4}-\d{2}-\d{2}/.exec(datetime)[0];

  return '';
};

export const reorder = (array, index) => {
  let head = array.slice(0, index);
  let tail = array.slice(index);

  return [...tail, ...head];
};

export const shuffle = array => {
  let currentIndex = array.length;
  let randomIndex;
  let temporaryValue;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export const formatNumber = num => {
  if (!num) return 0;
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export const swap = (array, a, b) => {
  const res = [...array];

  let temp = res[a];
  res[a] = res[b];
  res[b] = temp;

  return res;
};

export const getCircularIndex = (index, length) => {
  let diff = length - 1 - index;
  if (diff < 0) return 0;
  if (diff >= length) return length - 1;

  return index;
};

export const useEffectSkip = (fn, inputs) => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
};

export const fixedPrices = {
  one: [4900, '1 day'],
  week: [10000, '1 week'],
  month: [49000, '1 month'],
  month3: [135000, '3 months'],
  month6: [289000, '6 months'],
  year: [490000, '1 year']
};

export const months = {
  short: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  full: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
};

export const createMonthOptions = () => {
  let options = [];

  for (let i = 1; i <= 12; i++) {
    options.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  return options;
};

export const createYearOptions = (
  start = 2019,
  end = new Date().getFullYear()
) => {
  let options = [];

  for (let i = start; i <= end; i++) {
    options.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  return options;
};

const colormap = interpolate(['#4d4d4d', '#9100ea', '#46a049', '#23aecd']);

export const mapColor = (amount, total) => {
  return colormap(amount / total);
};

export const current = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear()
};

export const streamCompare = {
  total: 10,
  release: 10,
  track: 20
};

export const model = {
  track: {
    title: '',
    genres: [],
    producer: ''
  },
  audio: {
    audio128: null,
    audio320: null
  }
};

export const currency = 'VND';
