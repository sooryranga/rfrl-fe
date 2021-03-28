import Vue from 'vue';

export const responseToProfile = (profileResponse) => {
  if (!profileResponse) return;

  const profile = {...profileResponse};
  if (profile.createdAt) {
    profile.createdAt = new Date(profile.createdAt);
  }

  if (profile.updateAt) {
    profile.updateAt = new Date(profile.updateAt);
  }

  return profile;
};

export const ProfileService = {
  async get(id) {
    const response = await Vue.axios.get(`client/${id}/`);
    return responseToProfile(response.data);
  },
  async update(id, profile) {
    const response = await Vue.axios.put(`client/${id}/`, profile);
    return responseToProfile(response.data);
  },
  async create(profile) {
    const response = await Vue.axios.post(`client/`, profile);
    return responseToProfile(response.data);
  },
};


export default {responseToProfile, ProfileService};
