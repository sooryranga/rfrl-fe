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
  {name: 'Math', value: 'math'},
  {name: 'English', value: 'english'},
  {name: 'Science', value: 'science'},
  {name: 'Music', value: 'music'},
];

const datePosted = [
  {name: 'Past 24 hours', value: 'past_24_hours'},
  {name: 'Past Week', value: 'past_week'},
  {name: 'Past Month', value: 'past_month'},
  {name: 'Any Time', value: 'any_time'},
];


export {
  formatAMPM,
  phonenumber,
  dayOfWeekMapping,
  tags,
  datePosted,
};
