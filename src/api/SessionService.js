import Vue from 'vue';

export const SessionService = {
  async getSession(roomId, params) {
    return await Vue.axios.get(`message-room/${roomId}`, params);
  },
  async getMessages(roomId, params) {
    return await Vue.axios.get(`messages/${roomId}`, params);
  },
  async create(roomId, message) {
    return await Vue.axios.post(`message-room/${roomId}`, message);
  },
  async getRooms(params) {
    return await Vue.axios.get('rooms', params);
  },
  async getRoom(id, params) {
    return await Vue.axios.get(`rooms/${id}`, params);
  },
  async getUserStatus(userId, params) {
    return await Vue.axios.get(`user/${userId}/status`, params);
  },
};
