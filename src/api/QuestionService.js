import Vue from 'vue';

export const QuestionService = {
  async getQuestions() {
    const response = await Vue.axios.get(`questions/`);
    return response.data;
  },
  async getQuestionsForUser(userID) {
    const response = await Vue.axios.get(`questions/${userID}/`);
    return response.data;
  },
  async get(questionID) {
    const response = await Vue.axios.get(`question/${questionID}`);
    return response.data;
  },
  async create(questionPayload) {
    payload = {
      'title': questionPayload.title,
      'body': questionPayload.body,
      'images': questionPayload.images,
      'tags': questionPayload.tags,
    };
    const response = await Vue.axios.post(`question/`, payload);
    return response.data;
  },
  async update(id, questionPayload) {
    payload = {
      'title': questionPayload.title,
      'body': questionPayload.body,
      'images': questionPayload.images,
      'tags': questionPayload.tags,
    };
    return await Vue.axios.put(`question/${id}`, payload);
  },
  async delete(id) {
    return await Vue.axios.delete(`question/${id}`);
  },
  async apply(id) {
    return await Vue.axios.post(`question/${id}/apply`);
  },
};
