import {Question} from '@/api';
import {getErrorMessageFromRequest} from '@/utils';

import {
  SET_ADD_QUESTION,
  SET_MORE_QUESTIONS,
  SET_SELECT_QUESTION,
  SET_QUESTION_ERROR,
  SET_UPDATE_QUESTION,
  SET_QUESTION_EDITOR,
} from '@/constants.mutations.js';

const state = {
  error: null,
  selectedQuestionID: null,
  questions: [],
  editorOpen: false,
  editorQuestionID: null,
};

const getters = {
  questions: (state) => state.questions,
  getQuestion: (state) => (id) => {
    return state.questions.find((question) => question.id==id);
  },
  selectedQuestion: (state) => {
    if (state.selectedQuestionID === null) {
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
      {questionID},
  ) {
    let question = getters.getQuestion(questionID);
    if (question != null) {
      return question;
    }
    try {
      question = await Question.QuestionService.get(questionID);
      commit(SET_ADD_QUESTION, question);
      return question;
    } catch (error) {
      console.error(error);
      const errorString = getErrorMessageFromRequest(error);
      commit(SET_QUESTION_ERROR, errorString);
    }
  },

  async getQuestions(
      {commit, getters},
      {setSelected=true, getMore=false},
  ) {
    const questions = getters.questions;
    if (getMore == false && questions != null) {
      return questions;
    }

    const lastQuestion = questions.length > 0 ?
      questions[questions.length-1].id :
      null;

    try {
      const questions = await Question.QuestionService.getQuestions(
          {lastQuestion},
      );
      commit(SET_MORE_QUESTIONS, questions);

      if (setSelected && questions) {
        commit(SET_SELECT_QUESTION, questions[0].id);
      }
      return questions;
    } catch (error) {
      console.error(error);
      const errorString = getErrorMessageFromRequest(error);
      commit(SET_QUESTION_ERROR, errorString);
      return [];
    }
  },

  selectQuestion({commit, getters}, id) {
    if (id === null) {
      commit(SET_SELECT_QUESTION, null);
      return null;
    }

    const selectedQuestion = getters.selectedQuestion;
    if (selectedQuestion?.id === id) {
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

  async applyToQuestion({commit, getters}, questionID) {
    try {
      Question.QuestionService.apply(questionID);
    } catch (err) {
      console.error(err);
      const errorString = getErrorMessageFromRequest(error);
      commit(SET_QUESTION_ERROR, errorString);
      return null;
    }

    const question = getters.getQuestion(questionID);

    commit(
        SET_UPDATE_QUESTION,
        {...question, applicants: question.applicants + 1},
    );
  },

  async updateQuestion({dispatch, commit}, payload) {
    const id = payload.id;
    const question = await dispatch('getQuestion', {id});
    if (question === null) {
      commit(SET_QUESTION_ERROR, 'Updating Question does not exist');
    }

    try {
      question = await Question.QuestionService.update(id, payload);
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

  async createQuestion({commit}, payload) {
    try {
      const question = await Question.QuestionService.create(payload);
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
