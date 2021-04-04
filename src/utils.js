/**
 * Get AM/PM formatted time stamp as string
 * @param {Date} date the date.
 * @return {Str} stringified time of the day.
 */
function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

/**
 * Check whether text is phone number.
 * @param {Str} phonetext the date.
 * @return {Boolean} whether text is a phone nubmer.
 */
function phonenumber(phonetext) {
  const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return inputtxt.value.match(phoneno);
}

const dayOfWeekMapping = [
  'Mon',
  'Tue',
  'Wed',
  'Thur',
  'Fri',
  'Sat',
  'Sun',
];

const tags = [
  {name: 'Math', key: 'math'},
  {name: 'English', key: 'english'},
  {name: 'Science', key: 'science'},
  {name: 'Music', key: 'music'},
];

const tagKeyValue = {};

for (const v of tags) {
  tagKeyValue[v.key] = v;
};

const datePosted = [
  {name: 'Past 24 hours', key: 'past_24_hours'},
  {name: 'Past Week', key: 'past_week'},
  {name: 'Past Month', key: 'past_month'},
  {name: 'Any Time', key: 'any_time'},
];

const datePostedKeyValue = {};

for (const v of datePosted) {
  datePostedKeyValue[v.key] = v;
}

export const parseTimestamp = (timestamp, format = '') => {
  if (!timestamp) return;

  const date = timestamp.seconds ?
    new Date(timestamp.seconds * 1000) :
    timestamp;

  if (format === 'HH:mm') {
    return `${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`;
  } else if (format === 'DD MMMM YYYY') {
    const options = {month: 'long', year: 'numeric', day: 'numeric'};
    return `${new Intl.DateTimeFormat('en-GB', options).format(date)}`;
  } else if (format === 'DD/MM/YY') {
    const options = {month: 'numeric', year: 'numeric', day: 'numeric'};
    return `${new Intl.DateTimeFormat('en-GB', options).format(date)}`;
  } else if (format === 'DD MMMM, HH:mm') {
    const options = {month: 'long', day: 'numeric'};
    return `${new Intl.DateTimeFormat('en-GB', options).format(
        date,
    )}, ${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`;
  }

  return date;
};

const zeroPad = (num, pad) => {
  return String(num).padStart(pad, '0');
};

export const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const getErrorMessageFromRequest = (error) => {
  if (error.response) {
    // Request made and server responded
    return error.response.data['message'];
  } else if (error.request) {
    // The request was made but no response was received
    return 'Something went wrong trying to call' + String(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message;
  }
};

export {
  formatAMPM,
  phonenumber,
  dayOfWeekMapping,
  tags,
  datePosted,
  tagKeyValue,
  datePostedKeyValue,
};
