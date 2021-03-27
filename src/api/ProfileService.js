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

export default {responseToProfile};
