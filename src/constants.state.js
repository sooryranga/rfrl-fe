const profileState = () => {
  return {
    id: null,
    firstName: null,
    lastName: null,
    photo: null,
    about: null,
    education: null,
    workExperience: [],
    canBeTutor: true,
    tutoredStudents: [],
    institution: null,
    degree: null,
    fieldOfStudy: null,
    startYear: null,
    endYear: null,

    workEmail: null,
    verifiedWorkEmail: null,
    companyName: null,
    email: null,
    verifiedEmail: null,
    isLookingForReferral: false,
  };
};

const documentState = () => {
  return {
    id: null,
    name: null,
    description: null,
    src: null,
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
    createdAt: null,
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
  tutoredStudentsState,
  tutorReview,
  chatRoomState,
};
