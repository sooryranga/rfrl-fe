import Vue from 'vue';

export const SessionService = {
  async getPrendingSession(roomId) {
    return await Vue.axios.get(`message-room/${roomId}`);
  },
  async getScheduledSessions(roomId) {
    return await Vue.axios.get(`message-room/${roomId}`);
  },
  async save(sessionId, session) {
    return await Vue.axios.put(`session/${sessionId}`, session);
  },
  async create(roomId, session) {
    return await Vue.axios.post(`message-room/${roomId}/session`, session);
  },
  async delete(sessionId) {
    return await Vue.axios.delete(`session/${sessionId}`);
  },
};
