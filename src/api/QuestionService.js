import Vue from 'vue';

import {Profile} from '.';

export const responseToQuestion = (questionResponse) => {
  if (!questionResponse) return null;

  const question = {...questionResponse};
  if (question.createdAt) {
    question.createdAt = new Date(question.createdAt);
  }

  if (question.updateAt) {
    question.updateAt = new Date(question.updateAt);
  }

  if (question.profile) {
    question.profile = Profile.responseToProfile(question.profile);
  }

  return question;
};

export const QuestionService = {
  async getQuestions() {
    const response = await Vue.axios.get(`questions/`);
    const responseData = response.data;
    const questions = responseData.map((questionR) => (
      responseToQuestion(questionR)
    ));
    return questions;
  },
  async getQuestionsForUser(userID) {
    const response = await Vue.axios.get(`questions/${userID}/`);
    const questionsResponse = response.data;

    const questions = questionsResponse.map((questionR) => (
      responseToQuestion(questionR)
    ));
    return questions;
  },
  async get(questionID) {
    const response = await Vue.axios.get(`question/${questionID}`);
    return responseToQuestion(response.data);
  },
  async create({title, body, tags}) {
    const payload = {
      'title': title,
      'body': body,
      'tags': tags,
    };
    const response = await Vue.axios.post(`question/`, payload);
    return responseToQuestion(response.data);
  },
  async update(id, {title, body, tags}) {
    payload = {
      'title': title,
      'body': body,
      'tags': tags,
    };
    const response = await Vue.axios.put(`question/${id}`, payload);
    return responseToQuestion(response.data);
  },
  async delete(id) {
    return await Vue.axios.delete(`question/${id}`);
  },
  async apply(id) {
    return await Vue.axios.post(`question/${id}/apply`);
  },
};


export default {responseToQuestion, QuestionService};
