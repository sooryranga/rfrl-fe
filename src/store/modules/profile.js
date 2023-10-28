import {v1 as uuidv1} from 'uuid';

import {
  TUTORED_STUDENTS, DOCUMENTS, EDUCATION, TUTOR_REVIEW,
  ADD_DOCUMENT, ADD_EDUCATION,
  GOOGLE_LOGIN, LINKED_IN_LOGIN, DEFAULT_LOGIN,
  LOGOUT,
} from '@/constants.actions.js';
import {
  SET_PROFILE, SET_UPDATE_PROFILE,
  SET_TUTORED_STUDENTS, SET_DOCUMENTS, SET_EDUCATION,
  SET_TUTOR_REVIEW, SET_DOCUMENT,
  SET_EDUCATIONS, SET_LOGGED_IN, SET_GOOGLE_AUTH,
  SET_LINKED_IN_AUTH, SET_DEFAULT_AUTH, SET_LOGGED_OUT,
} from '@/constants.mutations.js';


import {profileState} from '@/constants.state.js';
import {Auth, Profile} from '@/api';

import {usersRef} from '@/firestore';

const blankState = {
  google: {token: null},
  linkedin: {token: null},
  default: {username: null, passwordHash: null},
  loggedIn: false,
  profile: profileState(),
};

const state ={
  profile: profileState(),
  google: {token: null},
  linkedin: {token: null},
  default: {username: null, passwordHash: null},
  loggedIn: false,
};

const getters = {
  currentProfile: (state) => state.profile,
  loggedIn: (state) => state.loggedIn,
};

const actions = {
  async updateProfile({commit, getters}, profile) {
    if (!getters.loggedIn || !getters.currentProfile) {
      throw Error('User is not logged in');
    }

    const updatedProfile = await Profile.ProfileService.update(
        getters.currentProfile.id,
        profile,
    );

    if (profile.photo) {
      await usersRef.doc(updatedProfile.id).set(
          {
            _id: updatedProfile.id,
            username: updatedProfile.name,
            avatar: updatedProfile.photo,
          },
      );
    }

    commit(SET_UPDATE_PROFILE, updatedProfile);
  },
  async [TUTORED_STUDENTS]({commit}) {
    commit(SET_TUTORED_STUDENTS, [
      {profileId: uuidv1(), name: 'soory', lastTutoredDate: new Date(), image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png'},// eslint-disable-line
      {profileId: uuidv1(), name: 'arun', lastTutoredDate: new Date(), image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png'},// eslint-disable-line
    ]);
  },
  async [DOCUMENTS]({commit}) {
    commit(SET_DOCUMENTS, [
      {id: 14, name: 'resume', type: 'application/pdf', src: 'https://www.w3.org/wai/er/tests/xhtml/testfiles/resources/pdf/dummy.pdf', description: 'my resume is super big and nastymy resume is super big and nastymy resume is super big and nastymy resume is super big and nastymy resume is super big and nastymy resume is super big and nasty'}, // eslint-disable-line
      {id: 15, name: 'grade report', type: 'image/jpeg', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/image_created_with_a_mobile_phone.png', description: 'my grade report'}, // eslint-disable-line
    ]);
  },
  async [EDUCATION]({commit}) {
    commit(SET_EDUCATIONS, [
      {id: uuidv1(), institution: 'Waterloo', degree: 'bachelorrs', fieldOfStudy: 'engineering', start: new Date(2014, 0, 1, 0, 0, 0, 0), end: new Date(2019, 0, 1, 0, 0), institutionLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/University_of_Waterloo_seal.svg/1920px-University_of_Waterloo_seal.svg.png'},// eslint-disable-line
    ]);
  },
  async [TUTOR_REVIEW]({commit}) {
    commit(SET_TUTOR_REVIEW, [
      {studentImage: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png', studentName: 'Arun', id: 12, title: 'Good tutor', createdAt: new Date(), stars: 4.5, description: 'He taught me well'}, //eslint-disable-line
      {studentImage: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png', studentName: 'Soory',id: 1, title:'meh, there are other tutors', createdAt: new Date(), stars: 2.5, description: 'couldn\' speak english properly'}, // eslint-disable-line
    ]);
  },
  async [ADD_DOCUMENT]({commit}, {index, newDocument}) {
    commit(SET_DOCUMENT, {index, newDocument});
  },
  async [ADD_EDUCATION]({commit}, {index, newEducation}) {
    commit(SET_EDUCATION, {index, newEducation});
  },
  async loginAuthorized({commit}) {
    const client = await Auth.AuthService.loginAuthorized();

    commit(SET_LOGGED_IN);
    commit(SET_PROFILE, client);
  },
  async [GOOGLE_LOGIN]({commit}, {token, name, imageUrl}) {
    await Auth.AuthService.signupGoogle({token, name, imageUrl});

    commit(SET_GOOGLE_AUTH, {token, name, imageUrl});
    commit(SET_LOGGED_IN);
  },
  [LINKED_IN_LOGIN]({commit}, token) {
    commit(SET_LINKED_IN_AUTH, token);
    commit(SET_LOGGED_IN);
  },
  [DEFAULT_LOGIN]({commit}, username, password) {
    commit(SET_DEFAULT_AUTH, username, password);
    commit(SET_LOGGED_IN);
  },
  [LOGOUT]() {
    commit(SET_LOGGED_OUT);
  },
};

const mutations = {
  [SET_PROFILE](state, profile) {
    state.profile = {...blankState.profile, ...profile};
  },
  [SET_UPDATE_PROFILE](state, updatedProfile) {
    state.profile = {...state.profile, ...updatedProfile};
  },
  [SET_TUTORED_STUDENTS](state, tutoredStudents) {
    state.profile.tutoredStudents = tutoredStudents;
  },
  [SET_DOCUMENTS](state, documents) {
    state.profile.documents = documents;
  },
  [SET_EDUCATIONS](state, education) {
    state.profile.education = education;
  },
  [SET_EDUCATION](state, {index, newEducation}) {
    if (index != null) {
      state.profile.education[index] = newEducation;
    } else {
      state.profile.education.push(newEducation);
    }
  },
  [SET_TUTOR_REVIEW](state, reviews) {
    state.profile.tutorReviews = reviews;
  },
  [SET_DOCUMENT](state, {index, newDocument}) {
    if (index != null) {
      state.profile.documents[index] = newDocument;
    } else {
      state.profile.documents.push(newDocument);
    };
  },
  [SET_LOGGED_IN](state) {
    if (!state.loggedIn) {
      state.loggedIn = true;
    }
  },
  [SET_GOOGLE_AUTH](state, token) {
    state.google.token = token;
  },
  [SET_LINKED_IN_AUTH](state, token) {
    state.linkedin.token = token;
  },
  [SET_DEFAULT_AUTH](state, username, pass) {
    state.default= {username: username, passwordHash: pass};
  },
  [SET_LOGGED_OUT](state) {
    state = {...blankState};
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
