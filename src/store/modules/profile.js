import {v1 as uuidv1} from 'uuid';

import {
  PROFILE_PICTURE, NAME, TUTORED_STUDENTS,
  DOCUMENTS, EDUCATION,
} from '@/constants.actions.js';
import {
  SET_PROFILE, SET_PROFILE_IMAGE, SET_NAME,
  SET_TUTORED_STUDENTS, SET_DOCUMENTS, SET_EDUCATION,
} from '@/constants.mutations.js';


const state ={
  profile: {
    id: null,
    name: null,
    birthDay: null,
    profileImage: null,
    about: null,
    education: [],
    workExperience: {},
    documentation: {},
    isTutor: true,
    tutoredStudents: [],
    documents: [],
  },
};

const getters = {
  'getProfile': (state) => state.profile,
};

const actions = {
  [PROFILE_PICTURE]({commit}, image) {
    commit(SET_PROFILE_IMAGE, image);
  },
  [NAME]({commit}, name) {
    commit(SET_NAME, name);
  },
  async [TUTORED_STUDENTS]({commit}) {
    commit(SET_TUTORED_STUDENTS, [
      {profileId: uuidv1(), name: 'soory', lastTutoredDate: new Date(), image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png'},// eslint-disable-line
      {profileId: uuidv1(), name: 'arun', lastTutoredDate: new Date(), image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png'},// eslint-disable-line
    ]);
  },
  async [DOCUMENTS]({commit}) {
    commit(SET_DOCUMENTS, [
      {name: 'resume', type: 'application/pdf', src: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', description: 'My resume'}, // eslint-disable-line
      {name: 'Grade Report', type: 'image/jpeg', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png', description: 'My grade report'}, // eslint-disable-line
    ]);
  },
  async [EDUCATION]({commit}) {
    commit(SET_EDUCATION, [
      {id: uuidv1(), institution: 'Waterloo', degree: 'bachelorrs', fieldOfStudy: 'engineering', start: 2014, end: 2019, institutionLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/University_of_Waterloo_seal.svg/1920px-University_of_Waterloo_seal.svg.png'},// eslint-disable-line
    ]);
  },
};

const mutations = {
  [SET_PROFILE](state, profile) {
    state.profile = {...profile};
  },
  [SET_PROFILE_IMAGE](state, imageSrc) {
    state.profile.profileImage = imageSrc;
  },
  [SET_NAME](state, name) {
    state.profile.name = name;
    state.profile.id = uuidv1();
  },
  [SET_TUTORED_STUDENTS](state, tutoredStudents) {
    state.profile.tutoredStudents = tutoredStudents;
  },
  [SET_DOCUMENTS](state, documents) {
    state.profile.documents = documents;
  },
  [SET_EDUCATION](state, education) {
    state.profile.education = education;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
