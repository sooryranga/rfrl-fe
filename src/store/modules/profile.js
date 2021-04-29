import {v1 as uuidv1} from 'uuid';

import {
  SET_PROFILE, SET_UPDATE_PROFILE,
  SET_TUTORED_STUDENTS, SET_DOCUMENTS, SET_EDUCATION,
  SET_TUTOR_REVIEW, SET_DOCUMENT,
  SET_EDUCATIONS, SET_LOGGED_IN, SET_GOOGLE_AUTH,
  SET_LINKED_IN_AUTH, SET_EMAIL_AUTH, SET_LOGGED_OUT,
  SET_AUTH_ERROR,
} from '@/constants.mutations.js';

import {getErrorMessageFromRequest} from '@/utils';


import {profileState} from '@/constants.state.js';
import {Auth, Profile} from '@/api';

import {usersRef} from '@/firestore';

const blankState = () => ({
  google: {token: null},
  linkedin: {token: null},
  email: {email: null},
  loggedIn: false,
  type: null,
  profile: profileState(),
});

const GOOGLE = 'GOOGLE';
const LINKED_IN = 'LINKED_IN';
const EMAIL = 'EMAIL';

const state ={
  profile: profileState(),
  google: {token: null},
  linkedin: {token: null},
  email: {username: null},
  type: null,
  loggedIn: false,
  error: null,
};

const getters = {
  currentProfile: (state) => state.profile,
  loggedIn: (state) => state.loggedIn,
  type: (state) => state.type,
  error: (state) => state.error,
};

const actions = {
  async updateProfile(
      {commit, getters},
      {firstName, lastName, photo, about, isTutor},
  ) {
    console.log({firstName, lastName, photo, about, isTutor});
    if (!getters.loggedIn || !getters.currentProfile) {
      throw Error('User is not logged in');
    }

    const updatedProfile = await Profile.ProfileService.update(
        getters.currentProfile.id,
        {firstName, lastName, photo, about, isTutor},
    );

    if (photo) {
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
  async tutoredStudents({commit}) {
    commit(SET_TUTORED_STUDENTS, [
      {from: {id:uuidv1()}, name: 'soory', lastTutoredDate: new Date(), image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png'},// eslint-disable-line
      {from: {id:uuidv1()}, name: 'arun', lastTutoredDate: new Date(), image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png'},// eslint-disable-line
    ]);
  },
  async getDocuments({commit}) {
    commit(SET_DOCUMENTS, [
      {id: 14, name: 'resume', type: 'application/pdf', src: 'https://www.w3.org/wai/er/tests/xhtml/testfiles/resources/pdf/dummy.pdf', description: 'my resume is super big and nastymy resume is super big and nastymy resume is super big and nastymy resume is super big and nastymy resume is super big and nastymy resume is super big and nasty'}, // eslint-disable-line
      {id: 15, name: 'grade report', type: 'image/jpeg', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/image_created_with_a_mobile_phone.png', description: 'my grade report'}, // eslint-disable-line
    ]);
  },
  async getEducation({commit}) {
    commit(SET_EDUCATIONS, [
      {id: uuidv1(), institution: 'Waterloo', degree: 'bachelorrs', fieldOfStudy: 'engineering', start: new Date(2014, 0, 1, 0, 0, 0, 0), end: new Date(2019, 0, 1, 0, 0), institutionLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/University_of_Waterloo_seal.svg/1920px-University_of_Waterloo_seal.svg.png'},// eslint-disable-line
    ]);
  },
  async getTutorReviews({commit}) {
    commit(SET_TUTOR_REVIEW, [
      {studentImage: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png', studentName: 'Arun', id: 12, title: 'Good tutor', createdAt: new Date(), stars: 4.5, description: 'He taught me well'}, //eslint-disable-line
      {studentImage: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png', studentName: 'Soory',id: 1, title:'meh, there are other tutors', createdAt: new Date(), stars: 2.5, description: 'couldn\' speak english properly'}, // eslint-disable-line
    ]);
  },
  async addDocument({commit}, {index, newDocument}) {
    commit(SET_DOCUMENT, {index, newDocument});
  },
  async addEducation({commit}, {index, newEducation}) {
    commit(SET_EDUCATION, {index, newEducation});
  },

  async loginAuthorized({commit}) {
    try {
      const {profile, auth} = await Auth.AuthService.loginAuthorized();
      if (!profile) {
        return;
      }

      commit(SET_LOGGED_IN);
      commit(SET_PROFILE, profile);
      return auth;
    } catch (err) {
      commit(SET_AUTH_ERROR, getErrorMessageFromRequest(err));
    }
  },
  async googleLogin({commit}, {token, name, imageUrl}) {
    const {profile, auth} = await Auth.AuthService.signupGoogle(
        {token, name, imageUrl},
    );

    if (!profile) {
      return;
    }

    commit(SET_PROFILE, profile);
    commit(SET_GOOGLE_AUTH, {token, name, imageUrl});
    commit(SET_LOGGED_IN);
    return auth;
  },
  async linkedinLogin({commit}, {token}) {
    const {profile, auth} = await Auth.AuthService.signupLinkedIn({token});

    if (!profile) {
      return;
    }

    commit(SET_PROFILE, profile);
    commit(SET_LINKED_IN_AUTH, token);
    commit(SET_LOGGED_IN);
    return auth;
  },
  async emailLogin({commit}, {email, password}) {
    const {profile, auth} = await Auth.AuthService.loginEmail(
        {email, password},
    );

    if (!profile) {
      return;
    }

    commit(SET_PROFILE, profile);
    commit(SET_EMAIL_AUTH, email);
    commit(SET_LOGGED_IN);
    return auth;
  },
  async emailRegister({commit}, {email, password}) {
    try {
      const {profile, auth} = await Auth.AuthService.signupPassword(
          {email, password},
      );

      if (!profile) {
        return;
      }

      commit(SET_PROFILE, profile);
      commit(SET_EMAIL_AUTH, email);
      commit(SET_LOGGED_IN);
      return auth;
    } catch (err) {
      commit(SET_AUTH_ERROR, getErrorMessageFromRequest(err));
      throw err;
    }
  },
  async logout({commit, getters}) {
    const loginType = getters.type;
    if (loginType === GOOGLE) {
      const auth2 = gapi.auth2.getAuthInstance();
      await auth2.signOut();
      auth2.disconnect();
    }

    commit(SET_LOGGED_OUT);
    Auth.destroyToken();
  },
};

const mutations = {
  [SET_PROFILE](state, profile) {
    state.profile = {...blankState().profile, ...profile};
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
    state.type = GOOGLE;
  },
  [SET_LINKED_IN_AUTH](state, token) {
    state.linkedin.token = token;
    state.type = LINKED_IN;
  },
  [SET_EMAIL_AUTH](state, email) {
    state.default= {email};
    state.type = EMAIL;
  },
  [SET_LOGGED_OUT](state) {
    Object.assign(state, blankState());
  },
  [SET_AUTH_ERROR](state, error) {
    state.error = error;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
