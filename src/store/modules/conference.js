import {Conference} from '@/api';
import {conferenceCodeRef} from '@/firestore';

import {
  SET_CODE_IS_RUNNING,
  SET_CODE,
  SET_CODE_RESULT_LISTENER,
  SET_CODE_RESULT,
  SET_RESET_CONFERENCE,
} from '@/constants.mutations.js';

const PER_PAGE = 5;

const blankCodeState = () => ({
  listener: null,
  codeResult: {},
  sessionId: '',
});


const state = {
  isRunning: false,
  runningCode: '',
  listener: null,
  codeResult: {},
  sessionId: '',
};

const getters = {
  isRunning: (state) => state.isRunning,
  isAutoUpdateCode: (state) => state.listener !== null,
  codeResult: (state) => {
    const results = Object.values(state.codeResult);
    results.sort((a, b) => {
      b.timestamp.seconds - a.timestamp.seconds;
    });
    return results;
  },
  rawCodeResult: (state) => state.codeResult,
  sessionId: (state) => state.sessionId,
};

/**
 * Will update messages
 * @param {object} getters
 * @param {object} commit
 * @param {string} sessionId
 * @param {object} snapshot
 */
function snapshotCodeResultAdded(getters, commit, sessionId, snapshot) {
  console.log('snapshotCodeResultAdded called');

  const results = {...getters.rawCodeResult};
  let needToSet = false;

  snapshot.docChanges().forEach(function(change) {
    needToSet = true;
    const result = change.doc.data();
    const id = change.doc.id;

    if (change.type === 'removed') {
      delete results[id];
      return;
    }
    results[id] = result;
  });
  if (!needToSet) return;

  commit(SET_CODE_RESULT, {sessionId, results});
}

const actions = {
  setToRunning({commit}) {
    commit(SET_CODE_IS_RUNNING, {isRunning: true});
  },
  async runCode({commit}, {code, sessionId, language}) {
    sessionId = parseInt(sessionId);
    try {
      commit(SET_CODE, {code});
      const {codeId} = await Conference.ConferenceService.submitCode(
          {sessionId, code, language},
      );
      const id = `${sessionId}-${codeId}`;
      const doc = conferenceCodeRef.doc(id);
      doc.set({sessionId, codeId, timestamp: new Date()});

      return id;
    } catch (err) {
      console.log(err);
      commit(SET_CODE_IS_RUNNING, {isRunning: false});
    }
  },
  async setCodeResults({commit, getters}, {sessionId}) {
    sessionId = parseInt(sessionId);
    if (getters.sessionId !== sessionId) {
      commit(SET_RESET_CONFERENCE);
    }

    if (getters.isAutoUpdateCode) {
      return;
    }

    const query = conferenceCodeRef
        .where('sessionId', '==', sessionId)
        .orderBy('timestamp', 'desc')
        .limit(PER_PAGE);

    const codeResults = await query.get();
    const results = {};
    codeResults.forEach((rawCodeResult) => {
      const codeResult = rawCodeResult.data();
      results[rawCodeResult.id] = codeResult;
    });

    const querySnapshot = await conferenceCodeRef
        .where('sessionId', '==', sessionId)
        .orderBy('timestamp');

    const unsubscribe = querySnapshot.onSnapshot((snapshot) => {
      snapshotCodeResultAdded(getters, commit, sessionId, snapshot);
    });

    commit(SET_CODE_RESULT_LISTENER, {listener: unsubscribe});
    commit(SET_CODE_RESULT, {sessionId, results});
  },
};

const mutations = {
  [SET_CODE_IS_RUNNING](state, {isRunning}) {
    state.isRunning = isRunning;
  },
  [SET_CODE](state, {code}) {
    state.code = code;
  },
  [SET_CODE_RESULT_LISTENER](state, {listener}) {
    state.listener = listener;
  },
  [SET_CODE_RESULT](state, {sessionId, results}) {
    state.sessionId = sessionId;
    state.codeResult = results;
  },
  [SET_RESET_CONFERENCE](state) {
    if (state.listener) {
      this.listener();
    }
    state = {...state, ...blankCodeState()};
  },
};

export default {
  state,
  getters,
  actions,
  namespaced: true,
  mutations,
};
