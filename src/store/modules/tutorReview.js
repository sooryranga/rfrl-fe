import {TutorReview} from '@/api';

import {
  SET_REQUIRED_REVIEW,
} from '@/constants.mutations.js';

const state = {
  pendingTutorReview: null,
  currentTutorName: null,
};

const getters = {
  showTutorReview: (state) => {
    return state.pendingTutorReview?.length !== 0;
  },
  pendingTutorReview: (state) => {
    return state.pendingTutorReview;
  },
  firstPendingTutorReview: (state) => {
    if (state.pendingTutorReview === null) return null;
    if (state.pendingTutorReview.length === 0 ) return null;
    return state.pendingTutorReview[0];
  },
};

const actions = {
  async getPendingTutorReview({commit, getters}) {
    if ( getters.pendingTutorReview !== null ) {
      return getters.pendingTutorReview;
    }

    const reviewRequiredForTutors = await TutorReview.
        TutorReviewService.
        getPendingTutorReview();

    commit(SET_REQUIRED_REVIEW, reviewRequiredForTutors);
    return reviewRequiredForTutors;
  },
  async submitTutorReview(
      {commit, getters},
      {id, headline, review, stars, tutorId},
  ) {
    if (id) {
      await TutorReview.TutorReviewService.put({
        id, headline, review, stars,
      });
    }
    await TutorReview.TutorReviewService.post({
      headline, review, stars, tutorId,
    });

    let isFiltered = false;
    const newTutorsToReview = getters.pendingTutorReview?.filter((tut) => {
      if (tut.tutorId === tutorId) {
        isFiltered = true;
      }
      return tut.tutorId !== tutorId;
    });

    if (isFiltered) {
      commit(SET_REQUIRED_REVIEW, newTutorsToReview);
    }
  },
  async ignoreTutorReview(
      {commit, getters},
      {tutorId, ignore},
  ) {
    if (ignore) {
      await TutorReview.TutorReviewService.ignoreTutorReview({tutorId});
    }
    let isFiltered = false;
    const newTutorsToReview = getters.pendingTutorReview?.filter((tut) => {
      if (tut.tutorId === tutorId) {
        isFiltered = true;
      }
      return tut.tutorId !== tutorId;
    });

    if (isFiltered) {
      commit(SET_REQUIRED_REVIEW, newTutorsToReview);
    }
  },
};

const mutations = {
  [SET_REQUIRED_REVIEW](state, reviewRequiredForTutors) {
    state.pendingTutorReview = reviewRequiredForTutors;
  },
};


export default {
  state,
  getters,
  actions,
  namespaced: true,
  mutations,
};
