import {firebase} from '@firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = process.env.NODE_ENV === 'development' ? {
  apiKey: 'AIzaSyCqFl4EOEA2a0ZPJEPzf9r8rq8En1gcKqA',
  authDomain: 'tutorproject-292921.firebaseapp.com',
  projectId: 'tutorproject-292921',
  storageBucket: 'tutorproject-292921.appspot.com',
  messagingSenderId: '328728240170',
  appId: '1:328728240170:web:2a470bf51a6ebbda2c6353',
  measurementId: 'G-QCL0E9CVTG',
}: {
  apiKey: 'AIzaSyAJ_rO4pplASf5KLMlQeWG_WITsTdeTcdU',
  authDomain: 'rfrl-598ca.firebaseapp.com',
  projectId: 'rfrl-598ca',
  storageBucket: 'rfrl-598ca.appspot.com',
  messagingSenderId: '713821417296',
  appId: '1:713821417296:web:fe319bde3d7351acf24655',
  measurementId: 'G-8J2QJ1JG8T',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const storageRef = firebase.storage().ref();

export const usersRef = db.collection('users');
export const roomsRef = db.collection('chatRooms');
export const messagesRef = (roomId) => {
  return roomsRef.doc(roomId).collection('messages');
};
export const conferenceCodeRef = db.collection('conferenceCode');

export const filesRef = storageRef.child('files');

export const profilePhotoRef = storageRef.child('profilePhotos');
export const documentRef = storageRef.child('document');

export const dbTimestamp = firebase.firestore.FieldValue.serverTimestamp();
export const deleteDbField = firebase.firestore.FieldValue.delete();

export const getAuth = () => {
  return firebase.auth();
};
