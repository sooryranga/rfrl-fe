import {v4 as uuidv4} from 'uuid';

const profileState = () => {
  return {
    id: '6R0MijpK6M4AIrwaaCY212312safdasd21e',
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

const chatRoomState = ()=>{
  return {
    roomId: null, // String or Number
    roomName: 'Room 1', // String
    lastMessage: {
      content: 'Last message received', // String
      sender_id: 1234,
      timestamp: '10:20',
      date: 123242424,
      seen: false,
      new: true,
    },
    users: [
      {
        _id: 1234,
        username: 'John Doe',
        status: {
          state: 'online',
          last_changed: 'today, 14:30',
        },
      },
      {
        _id: 4321,
        username: 'Doe John',
        status: {
          state: 'online',
          last_changed: 'today, 14:44',
        },
      },
    ],
  };
};

export {
  profileState,
  documentState,
  educationState,
  tutoredStudentsState,
  tutorReview,
  chatRoomState,
};
