import Vue from 'vue';
import {DEFAULT_PROFILE_PIC_URL} from '@/conf';

export const responseToProfile = (profileResponse) => {
  if (!profileResponse) return;

  const profile = {...profileResponse};
  if (profile.createdAt) {
    profile.createdAt = new Date(profile.createdAt);
  }

  if (profile.updatedAt) {
    profile.updatedAt = new Date(profile.updatedAt);
  }

  if (!profile.photo) {
    profile.photo = DEFAULT_PROFILE_PIC_URL;
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
  async update(
      id,
      {
        firstName, lastName, photo, about, isTutor,
        linkedInProfile, githubProfile, yearsOfExperience, workTitle,
      },
  ) {
    console.log({firstName, lastName, photo, about, isTutor});
    const response = await Vue.axios.put(
        `client/${id}/`,
        {
          firstName, lastName, photo, about, isTutor,
          linkedInProfile, githubProfile, yearsOfExperience, workTitle,
        },
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
  async updateWantingCompanyReferral(
      {profileId, isLookingForReferral, companyIds},
  ) {
    await Vue.axios.put(
        `client/${profileId}/wanting-company-referral/`,
        {isLookingForReferral, companyIds},
    );
  },
  async getWantingCompanyReferral(
      {profileId},
  ) {
    const res = await Vue.axios.get(
        `client/${profileId}/wanting-company-referral/`,
    );

    return res.data;
  },
};


export default {responseToProfile, ProfileService, USER_EMAIL, WORK_EMAIL};
