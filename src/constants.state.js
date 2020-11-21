import {v4 as uuidv4} from 'uuid';

const profileState = () => {
  return {
    id: uuidv4(),
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

const documentState = () => {
  return {
    id: uuidv4(),
    type: null,
    src: null,
    description: null,
  };
};

const educationState = () => {
  return {
    id: uuidv4(),
    institution: null,
    degree: null,
    fieldOfStudy: null,
    start: null,
    end: null,
    institutionLogo: null,
  };
};

const tutoredStudentsState = () => {
  return {
    profileId: null,
    name: null,
    lastTutoredDate: null,
    image: null,
  };
};

const tutorReview = () => {
  return {
    id: null,
    studentImage: null,
    studentName: null,
    title: null,
    createdDate: null,
    stars: null,
    description: null,
  };
};

export {
  profileState,
  documentState,
  educationState,
  tutoredStudentsState,
  tutorReview,
};
