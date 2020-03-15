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
