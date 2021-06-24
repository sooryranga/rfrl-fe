import Vue from 'vue';

export const SessionState = Object.freeze({
  SCHEDULED: 'scheduled',
  PENDING: 'pending',
});

export const responseToEvent = (response) => {
  if (!response) return;

  const event = {...response};
  if (event.createdAt) {
    event.createdAt = new Date(event.createdAt);
  }

  if (event.updatedAt) {
    event.updatedAt = new Date(event.updatedAt);
  }

  if (event.start) {
    event.start = new Date(event.start);
  }

  if (event.end) {
    event.end = new Date(event.end);
  }

  return event;
};

export const responseToSession = (response) => {
  if (!response) return;

  const session = {...response};
  if (session.createdAt) {
    session.createdAt = new Date(session.createdAt);
  }

  if (session.updatedAt) {
    session.updatedAt = new Date(session.updatedAt);
  }

  if (session.event) {
    session.event = responseToEvent(session.event);
  }
  return session;
};

export const SessionService = {
  async getConferenceId({sessionId}) {
    const response = await Vue.axios.get(`session/${sessionId}/conference/`);
    return response.data?.conferenceID;
  },
  async getSessionForProfile() {
    const response = await Vue.axios.get(
        `sessions/`,
        {state: SessionState.SCHEDULED},
    );
    const sessions = response.data.map((session) => {
      return responseToSession(session);
    });

    return sessions;
  },
  async getPrendingSession(roomId) {
    const response = await Vue.axios.get(
        `sessions/`,
        {params: {room_id: roomId, state: SessionState.PENDING}},
    );
    const sessions = response.data.map((session) => {
      return responseToSession(session);
    });

    return sessions;
  },
  async getScheduledSessions(roomId) {
    const response = await Vue.axios.get(
        `sessions/`,
        {params: {room_id: roomId, state: SessionState.SCHEDULED}},
    );

    const sessions = response.data.map((session) => {
      return responseToSession(session);
    });

    console.log(sessions);
    return sessions;
  },
  async createSessionEvent({sessionId, start, end, title}) {
    const response = await Vue.axios.post(
        `session/${sessionId}/event/`,
        {start, end, title},
    );
    return responseToEvent(response.data);
  },
  async bookSession({sessionId, canAttend}) {
    const response = await Vue.axios.post(
        `session/${sessionId}/book/`,
        {canAttend},
    );
    return response.data;
  },
  async get(id) {
    const response = await Vue.axios.get(`session/${id}/`);
    return responseToSession(response.data);
  },
  async save(id, session) {
    const response = await Vue.axios.put(`session/${id}/`, session);
    return responseToSession(response.data);
  },
  async create({session}) {
    const response = await Vue.axios.post(`session/`, session);

    return responseToSession(response.data);
  },
  async delete(id) {
    const response = await Vue.axios.delete(`session/${id}/`);
    return response.data;
  },
  async getRelatedEvents({id, start, end, state}) {
    const response = await Vue.axios.get(
        `session/${id}/event/`,
        {params: {start, end, state}},
    );

    const events = response.data.map((event) =>{
      return responseToEvent(event);
    });

    return events;
  },
  async getSessionEvent({SessionId, id}) {
    const response = await Vue.axios.get(`session/${SessionId}/event/${id}/`);
    return responseToEvent(response.data);
  },
};


export default {SessionService, SessionState};
