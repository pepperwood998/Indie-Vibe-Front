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
