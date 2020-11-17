const profileState = () => {
  return {
    id: null,
    name: null,
    birthDay: null,
    profileImage: null,
    about: null,
    education: [],
    workExperience: {},
    documentation: {},
    isTutor: true,
    tutoredStudents: [],
    documents: [],
    tutorReviews: [],
  };
};

export {
  profileState,
};
