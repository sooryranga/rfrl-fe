import Vue from 'vue';

export const SessionService = {
  async getSessionForProfile() {
    return await Vue.axios.get(
        `sessions/`,
        {state: 'scheduled'},
    );
  },
  async getPrendingSession(roomId) {
    return await Vue.axios.get(
        `session/`,
        {room_id: roomId, state: 'scheduled'},
    );
  },
  async getScheduledSessions(roomId) {
    return await Vue.axios.get(`session/`, {roomId, scheduled: true});
  },
  async selectSessionDates(id, eventIds, replace=false) {
    return await Vue.axios.post(
        `session/${id}/event/`,
        {events: eventIds, replace},
    );
  },
  async unselectSessionDates(id, eventIds) {
    return await Vue.axios.delete(`session/${id}/event/`, {events: eventIds});
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
