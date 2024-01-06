import {v1 as uuidv1} from 'uuid';

import {
  SET_PROFILE, SET_UPDATE_PROFILE,
  SET_TUTORED_STUDENTS, SET_EDUCATION,
  SET_LOGGED_IN, SET_GOOGLE_AUTH,
  SET_LINKED_IN_AUTH, SET_EMAIL_AUTH, SET_LOGGED_OUT,
  SET_AUTH_ERROR, SET_EMAIL_VERIFICATION,
} from '@/constants.mutations.js';

import {getErrorMessageFromRequest} from '@/utils';


import {profileState} from '@/constants.state.js';
import {Auth, Profile} from '@/api';

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
  currentProfileId: (state) => state.profile?.id,
  currentProfile: (state) => state.profile,
  loggedIn: (state) => state.loggedIn,
  logInType: (state) => state.type,
  isLookingForReferral: (state) => state.profile?.isLookingForReferral,
  error: (state) => state.error,
};

const actions = {
  async updateIsLookingForReferral(
      {getters, commit},
      {isLookingForReferral, companyIds},
  ) {
    await Profile.ProfileService.updateWantingCompanyReferral({
      profileId: getters.currentProfileId,
      isLookingForReferral,
      companyIds,
    });
    const updatedProfile = {...getters.currentProfile};
    updatedProfile.isLookingForReferral = isLookingForReferral;
    commit(SET_UPDATE_PROFILE, updatedProfile);
  },
  async updateProfile(
      {commit, getters},
      {
        firstName, lastName, photo, about, isTutor,
        linkedInProfile, githubProfile, yearsOfExperience, workTitle,
      },
  ) {
    if (!getters.loggedIn || !getters.currentProfile) {
      throw Error('User is not logged in');
    }

    const updatedProfile = await Profile.ProfileService.update(
        getters.currentProfile.id,
        {
          firstName, lastName, photo, about, isTutor,
          linkedInProfile, githubProfile, yearsOfExperience, workTitle,
        },
    );

    commit(SET_UPDATE_PROFILE, updatedProfile);
  },
  async tutoredStudents({commit}) {
    commit(SET_TUTORED_STUDENTS, [
      {from: {id:uuidv1()}, name: 'soory', lastTutoredDate: new Date(), image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png'},// eslint-disable-line
      {from: {id:uuidv1()}, name: 'arun', lastTutoredDate: new Date(), image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png'},// eslint-disable-line
    ]);
  },
  async setEducation(
      {commit, getters},
      {institution, degree, fieldOfStudy, startYear, endYear},
  ) {
    await Profile.ProfileService.updateEducation({
      id: getters.currentProfile.id,
      institution,
      degree,
      fieldOfStudy,
      startYear,
      endYear,
    });
    commit(
        SET_EDUCATION,
        {institution, degree, fieldOfStudy, startYear, endYear},
    );
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
      throw err;
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
    await Auth.AuthService.signOut();
    commit(SET_LOGGED_OUT);
    Auth.destroyToken();
  },
  setEmailVerification(
      {commit},
      {email, workEmail, companyName, verifiedWorkEmail, verifiedEmail},
  ) {
    console.log('setEmailVerification');
    commit(
        SET_EMAIL_VERIFICATION,
        {email, workEmail, companyName, verifiedWorkEmail, verifiedEmail},
    );
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
  [SET_EDUCATION](
      state,
      {institution, degree, fieldOfStudy, startYear, endYear},
  ) {
    state.profile = {
      ...state.profile,
      ...{institution, degree, fieldOfStudy, startYear, endYear},
    };
  },
  [SET_EMAIL_VERIFICATION](
      state,
      {email, workEmail, companyName, verifiedWorkEmail, verifiedEmail},
  ) {
    state.profile.companyName = companyName;
    state.profile.email = email;
    state.profile.workEmail = workEmail;
    state.profile.verifiedEmail = verifiedEmail;
    state.profile.verifiedWorkEmail = verifiedWorkEmail;
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
