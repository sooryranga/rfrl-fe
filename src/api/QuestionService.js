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
  async create({title, body, images, tags}) {
    payload = {
      'title': title,
      'body': body,
      'images': images,
      'tags': tags,
    };
    const response = await Vue.axios.post(`question/`, payload);
    return response.data;
  },
  async update(id, {title, body, images, tags}) {
    payload = {
      'title': title,
      'body': body,
      'images': images,
      'tags': tags,
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
