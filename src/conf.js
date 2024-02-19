const DaysEnum = Object.freeze(
    {GOOGLE: 1, LINKEDIN: 2, EMAIL: 3, PHONE: 4},
);
const API_URL = process.env.NODE_ENV === 'development' ?
  'http://localhost:8080':
  'https://backend.rfrl.ca';

const WS_URL = process.env.NODE_ENV === 'development' ?
  'ws://localhost:8080/conference':
  'ws://backend.rfrl.ca/conference';

export {
  DaysEnum,
  API_URL,
  WS_URL,
};
