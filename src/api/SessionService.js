import Vue from 'vue';

export const SessionService = {
  async getPrendingSession(roomId) {
    return await Vue.axios.get(`message-room/${roomId}`);
  },
  async getScheduledSessions(roomId) {
    return await Vue.axios.get(`message-room/${roomId}`);
  },
  async selectSessionDate(id, eventId) {
    return await Vue.axios.post(`session/${id}/event/${eventId}`);
  },
  async selectSessionDates(id, eventIds) {
    return await Vue.axios.post(`session/${id}/event`, {events: eventIds});
  },
  async get(id) {
    return await Vue.axios.get(`session/${id}`);
  },
  async save(id, session) {
    return await Vue.axios.put(`session/${id}`, session);
  },
  async create(roomId, session) {
    return await Vue.axios.post(`message-room/${roomId}/session`, session);
  },
  async delete(id) {
    return await Vue.axios.delete(`session/${id}`);
  },
};
