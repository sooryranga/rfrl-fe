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


const USER_EMAIL = 'user';
const WORK_EMAIL = 'work';

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
  async updateEducation(
      {id, institution, degree, fieldOfStudy, startYear, endYear},
  ) {
    const response = await Vue.axios.put(
        `client/${id}/education/`,
        {institution, degree, fieldOfStudy, startYear, endYear},
    );
    return responseToProfile(response.data);
  },

  // Email Service
  async getVerificationEmail({profileId, type}) {
    const response = await Vue.axios.get(
        `client/${profileId}/verify-email/`,
        {params: {type}},
    );
    return response.data.email;
  },
  async addEmail({profileId, type, email}) {
    await Vue.axios.post(
        `client/${profileId}/verify-email/`,
        {type, email},
    );
  },
  async verifyEmailPasscode({profileId, type, email, passcode}) {
    const response = await Vue.axios.put(
        `client/${profileId}/verify-email/`,
        {type, email, passcode},
    );
    return responseToProfile(response.data);
  },
  async deleteEmailRelation({profileId, type}) {
    await Vue.axios.delete(
        `client/${profileId}/verify-email/`,
        {params: {type}},
    );
  },
};


export default {responseToProfile, ProfileService, USER_EMAIL, WORK_EMAIL};
