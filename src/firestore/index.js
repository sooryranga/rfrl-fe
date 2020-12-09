import {firebase} from '@firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCqFl4EOEA2a0ZPJEPzf9r8rq8En1gcKqA',
  authDomain: 'tutorproject-292921.firebaseapp.com',
  projectId: 'tutorproject-292921',
  storageBucket: 'tutorproject-292921.appspot.com',
  messagingSenderId: '328728240170',
  appId: '1:328728240170:web:2a470bf51a6ebbda2c6353',
  measurementId: 'G-QCL0E9CVTG',
};
// Initialize Firebase
const defaultProject = firebase.initializeApp(firebaseConfig);

console.log(defaultProject.name);

export const db = firebase.firestore();
export const storageRef = firebase.storage().ref();

export const usersRef = db.collection('users');
export const roomsRef = db.collection('chatRooms');
export const messagesRef = (roomId) => {
  return roomsRef.doc(roomId).collection('messages');
};

export const filesRef = storageRef.child('files');

export const dbTimestamp = firebase.firestore.FieldValue.serverTimestamp();
export const deleteDbField = firebase.firestore.FieldValue.delete();
