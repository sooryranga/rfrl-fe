import Vue from 'vue';

export const DocumentService = {
  async getForUser(profileId) {
    return await Vue.axios.get(`document-order/`, null, {params: {
      ref_id: profileId,
      ref_type: 'client',
    }});
  },
  async getForSession(sessionId) {
    return await Vue.axios.get(`document-order/`, null, {params: {
      ref_id: sessionId,
      ref_type: 'session',
    }});
  },
  async _post(formData) {
    return await Vue.axios.post(
        '/documents/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
    );
  },
  async postForProfile(file, id) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('profileId', id);
    return await this._post(formData);
  },
  async postForSession(file, id) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', id);
    return await this._post(formData);
  },
};
