import Vue from 'vue';

export const SessionState = Object.freeze({
  SCHEDULED: 'scheduled',
  PENDING: 'pending',
});

export const SessionService = {
  async getSessionForProfile() {
    const response = await Vue.axios.get(
        `sessions/`,
        {state: SessionState.SCHEDULED},
    );
    return response.data;
  },
  async getPrendingSession(roomId) {
    const response = await Vue.axios.get(
        `sessions/`,
        {params: {room_id: roomId, state: SessionState.PENDING}},
    );
    return response.data;
  },
  async getScheduledSessions(roomId) {
    return await Vue.axios.get(
        `sessions/`,
        {params: {room_id: roomId, state: SessionState.SCHEDULED}},
    );
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
    return await Vue.axios.get(`session/${id}/`);
  },
  async save(id, session) {
    return await Vue.axios.put(`session/${id}/`, session);
  },
  async create({session}) {
    const response = await Vue.axios.post(`session/`, session);

    return response.data;
  },
  async delete(id) {
    return await Vue.axios.delete(`session/${id}/`);
  },
  async getRelatedEvents({id, startTime, endTime, state}) {
    const response = await Vue.axios.get(
        `session/${id}/event/`,
        {params: {startTime, endTime, state}},
    );
    return response.data;
  },
  async getSessionEvent({SessionId, id}) {
    const response = await Vue.axios.post(`session/${SessionId}/event/${id}/`);
    return response.data;
  },
};


export default {SessionService, SessionState};
