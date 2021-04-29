import Vue from 'vue';

export const responseToProfile = (profileResponse) => {
  if (!profileResponse) return;

  const profile = {...profileResponse};
  if (profile.createdAt) {
    profile.createdAt = new Date(profile.createdAt);
  }

  if (profile.updatedAt) {
    profile.updatedAt = new Date(profile.updatedAt);
  }

  return profile;
};

export const ProfileService = {
  async get(id) {
    const response = await Vue.axios.get(`client/${id}/`);
    return responseToProfile(response.data);
  },
  async update(id, {firstName, lastName, photo, about, isTutor}) {
    console.log({firstName, lastName, photo, about, isTutor});
    const response = await Vue.axios.put(
        `client/${id}/`,
        {firstName, lastName, photo, about, isTutor},
    );
    return responseToProfile(response.data);
  },
  async create(profile) {
    const response = await Vue.axios.post(`client/`, profile);
    return responseToProfile(response.data);
  },
};


export default {responseToProfile, ProfileService};
