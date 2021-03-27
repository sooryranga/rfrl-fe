import {QuestionService} from '@/api/QuestionService';

import {
  SET_ADD_QUESTION,
  SET_QUESTIONS,
  SET_MORE_QUESTIONS,
  SET_SELECT_QUESTION,
  SET_QUESTION_ERROR,
  SET_UPDATE_QUESTION,
  SET_QUESTION_EDITOR,
} from '@/constants.mutations.js';

const state = {
  error: null,
  selectedQuestionID: null,
  questions: null,
  editorOpen: false,
  editorQuestionID: null,
};

const getters = {
  questions: (state) => state.questions,
  getQuestion: (state) => (id) => {
    return state.questions.find((question) => question.id==id);
  },
  selectedQuestion: (state) => {
    if (state.selectedQuestionID == null) {
      return null;
    }
    return state.questions.find(
        (question) => question.id==state.selectedQuestionID,
    );
  },
  getQuestionError: (state) => state.error,
  isEditorOpen: (state) => state.editorOpen,
  editorQuestion: (state) => {
    if (state.editorQuestionID === null) {
      return null;
    }
    return state.questions.find(
        (question) => question.id==state.editorQuestionID,
    );
  },
  error: (state) => state.error,
};

const getErrorMessageFromRequest = (error) => {
  if (error.response) {
    // Request made and server responded
    return error.response.data['message'];
  } else if (error.request) {
    // The request was made but no response was received
    return 'Something went wrong trying to call' + String(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message;
  }
};

const actions = {
  openEditor(
      {commit},
      editorQuestionID,
  ) {
    commit(SET_QUESTION_EDITOR, {isOpen: true, editorQuestionID});
  },

  closeEditor(
      {commit},
  ) {
    commit(SET_QUESTION_EDITOR, {isOpen: false, editorQuestionID: null});
  },

  async getQuestion(
      {commit, getters},
      questionID,
      options = {setSelected: true},
  ) {
    let question = getters.getQuestion(id);
    if (question != null) {
      return question;
    }
    try {
      question = await QuestionService.get(questionID);
      commit(SET_ADD_QUESTION, question);
      return question;
    } catch (error) {
      console.error(error);
      const errorString = getErrorMessageFromRequest(error);
      commit(SET_QUESTION_ERROR, errorString);
    }
  },

  async getQuestions({commit, getters}, options={set_selected: true}) {
    let questions = getters.questions;

    if (questions) {
      return questions;
    }

    try {
      questions = await QuestionService.getQuestions();
      commit(SET_QUESTIONS, questions);
    } catch (error) {
      console.error(error);
      const errorString = getErrorMessageFromRequest(error);
      commit(SET_QUESTION_ERROR, errorString);
      return [];
    }

    if (options.setSelected && questions) {
      commit(SET_SELECT_QUESTION, questions[0].id);
    }
    return questions;
  },

  selectQuestion({commit, getters}, id, option={}) {
    if (id == null) {
      commit(SET_SELECT_QUESTION, null);
      return null;
    }

    const selectedQuestion = getters.selectedQuestion;
    if (selectedQuestion?.id == id) {
      return selectedQuestion;
    }
    const question = getters.getQuestion(id);

    if (question) {
      commit(SET_SELECT_QUESTION, id);
      return question;
    }
    commit(SET_QUESTION_ERROR, 'Selected Question does not exist');
    return null;
  },

  async updateQuestion({dispatch, commit}, id, payload, option={}) {
    const question = await dispatch('getQuestion', {id});
    if (question === null) {
      commit(SET_QUESTION_ERROR, 'Updating Question does not exist');
    }

    try {
      question = await QuestionService.update(id, payload);
    } catch (err) {
      console.error(err);
      const errorString = getErrorMessageFromRequest(error);
      commit(SET_QUESTION_ERROR, errorString);
      return null;
    }
    if (question) {
      commit(SET_UPDATE_QUESTION, question);
    }
    return question;
  },

  async createQuestion({commit}, payload, options={}) {
    try {
      const question = await QuestionService.create(payload);
      commit(SET_ADD_QUESTION, question);
      commit(SET_SELECT_QUESTION, question.id);
      return true;
    } catch (err) {
      console.error(err);
      const errorString = getErrorMessageFromRequest(err);
      commit(SET_QUESTION_ERROR, errorString);
      return false;
    }
  },
};

const mutations = {
  [SET_ADD_QUESTION](state, question) {
    state.questions.push(question);
  },
  [SET_QUESTIONS](state, questions) {
    state.questions = questions;
  },
  [SET_MORE_QUESTIONS](state, questions) {
    state.questions =[...state.questions, ...questions];
  },
  [SET_SELECT_QUESTION](state, selectedQuestionID) {
    state.selectedQuestionID = selectedQuestionID;
  },
  [SET_QUESTION_ERROR](state, error) {
    state.error = error;
  },
  [SET_UPDATE_QUESTION](state, updatedQuestion) {
    const filteredQuestion = state.questions.filter(
        (q) => q.id != updatedQuestion.id,
    );
    state.questions = [...filteredQuestion, updatedQuestion];
  },
  [SET_QUESTION_EDITOR](state, {isOpen, editorQuestionID}) {
    state.editorOpen = isOpen;
    state.editorQuestionID = editorQuestionID;
  },
};

export default {
  state,
  getters,
  actions,
  namespaced: true,
  mutations,
};
