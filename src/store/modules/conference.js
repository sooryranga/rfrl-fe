import {Conference} from '@/api';
import {conferenceCodeRef} from '@/firestore';

import {
  SET_RUN_CODE,
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
  runCode: false,
  runningCode: '',
  isCodeRunning: false,
  listener: null,
  codeResult: {},
  sessionId: '',
};

const getters = {
  runCode: (state) => state.runCode,
  isCodeRunning: (state) => state.isCodeRunning,
  isAutoUpdateCode: (state) => state.listener !== null,
  codeResultIds: (state) => {
    const results = Object.keys(state.codeResult).map(
        (id) => {
          const r = state.codeResult[id];
          r.id = id;
          return r;
        },
    );
    results.sort((a, b) => {
      return a.timestamp.getTime() - b.timestamp.getTime();
    });
    return results.map((r) => r.id);
  },
  getCodeResult: (state) => (id) => {
    if (!id) return {};
    return state.codeResult[id];
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
    result.timestamp = result.timestamp.toDate();
    results[id] = result;
  });
  if (!needToSet) return;

  commit(SET_CODE_RESULT, {sessionId, results});
}

const actions = {
  runCode({commit}) {
    commit(SET_RUN_CODE, {runCode: true});
  },
  async submitCode({commit, getters}, {code, sessionId, language}) {
    sessionId = parseInt(sessionId);

    if (getters.sessionId !== sessionId) {
      commit(SET_RESET_CONFERENCE);
    }

    try {
      commit(SET_CODE, {code});
      const {codeId} = await Conference.ConferenceService.submitCode(
          {sessionId, code, language},
      );
      const id = `${sessionId}-${codeId}`;
      const results = getters.rawCodeResult;
      results[id] = {sessionId, codeId, stdin: 'run', timestamp: new Date()};

      commit(SET_CODE_RESULT, {sessionId, results});
    } catch (err) {
      console.log(err);
    }

    commit(SET_RUN_CODE, {runCode: false});
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
      codeResult.timestamp = codeResult.timestamp.toDate();
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
  async addCodeResult({commit, getters}, {stdin, stdout}) {
    const results = getters.rawCodeResult;
    const sessionId = getters.sessionId;
    const length = Object.keys(results).length;
    const id = `${sessionId}-fromlocal-${length}`;
    results[id] = {stdin, stdout, sessionId, timestamp: new Date()};
    commit(SET_CODE_RESULT, {sessionId, results});
  },
  async clear({commit, getters}) {
    const sessionId = getters.sessionId;
    const query = await conferenceCodeRef
        .where('sessionId', '==', sessionId);
    const codeResults = await query.get();
    codeResults.forEach((rawCodeResult) => {
      rawCodeResult.ref.delete();
    });
    commit(SET_CODE_RESULT, {sessionId, results: {}});
  },
};

const mutations = {
  [SET_CODE_IS_RUNNING](state, {isCodeRunning}) {
    state.isCodeRunning = isCodeRunning;
  },
  [SET_RUN_CODE](state, {runCode}) {
    state.runCode = runCode;
  },
  [SET_CODE](state, {code}) {
    state.code = code;
  },
  [SET_CODE_RESULT_LISTENER](state, {listener}) {
    state.listener = listener;
  },
  [SET_CODE_RESULT](state, {sessionId, results}) {
    state.sessionId = sessionId;
    state.codeResult = {...results};
  },
  [SET_RESET_CONFERENCE](state) {
    if (state.listener) {
      state.listener();
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
