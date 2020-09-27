const state = {
  room: undefined, // Current room
  username: undefined, // Username
  status: STATUS_OPTIONS.available, // User status
  rooms: [], // Available rooms in the whole chat
};

const getters = {
  currentUser: (state) => state.currentUser,
};

const actions = {};

const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations,
};
