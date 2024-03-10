const DaysEnum = Object.freeze(
    {GOOGLE: 1, LINKEDIN: 2, EMAIL: 3, PHONE: 4},
);
const API_URL = process.env.NODE_ENV === 'development' ?
  'http://localhost:8080':
  'https://backend.rfrl.ca';

const WS_URL = process.env.NODE_ENV === 'development' ?
  'ws://localhost:8080/conference':
  'wss://backend.rfrl.ca/conference';

const DEFAULT_PROFILE_PIC_URL = process.env.NODE_ENV === 'development' ?
  'https://firebasestorage.googleapis.com/v0/b/tutorproject-292921.appspot.com/o/profilePhotos%2FdefaultProfilePic.png?alt=media&token=c3341621-4e9a-4267-8b81-ca499aff79e9': //eslint-disable-line
  'https://firebasestorage.googleapis.com/v0/b/rfrl-598ca.appspot.com/o/profilePhotos%2FdefaultProfilePic.png?alt=media&token=b80d8d6c-da8e-4c22-838c-147091937703'; //eslint-disable-line


export {
  DaysEnum,
  API_URL,
  WS_URL,
  DEFAULT_PROFILE_PIC_URL,
};
