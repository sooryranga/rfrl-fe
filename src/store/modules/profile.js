import {v1 as uuidv1} from 'uuid';

import {
  PROFILE_PICTURE, NAME, TUTORED_STUDENTS,
  DOCUMENTS, EDUCATION, TUTOR_REVIEW,
  ADD_DOCUMENT, ABOUT, ADD_EDUCATION,
} from '@/constants.actions.js';
import {
  SET_PROFILE, SET_PROFILE_IMAGE, SET_NAME,
  SET_TUTORED_STUDENTS, SET_DOCUMENTS, SET_EDUCATION,
  SET_TUTOR_REVIEW, SET_DOCUMENT, SET_ABOUT,
  SET_EDUCATIONS,
} from '@/constants.mutations.js';
import {profileState} from '@/constants.state.js';

import {usersRef} from '@/firestore';

const state ={
  profile: profileState(),
};

const getters = {
  'currentProfile': (state) => state.profile,
};

const actions = {
  async [PROFILE_PICTURE]({commit}, image) {
    commit(SET_PROFILE_IMAGE, image);
    await usersRef.doc(state.profile.id).set(
        {
          _id: state.profile.id,
          username: state.profile.name,
          avatar: image,
        },
    );
  },
  [NAME]({commit}, name) {
    commit(SET_NAME, name);
  },
  [ABOUT]({commit}, about) {
    commit(SET_ABOUT, about);
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
  },
  [SET_ABOUT](state, about) {
    state.profile.about = about;
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
