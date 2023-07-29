const state = {
  questions: [
    {
      id: 1,
      posterName: 'Arun',
      userId: 'SGmFnBZB4xxMv9V4CVlW',
      profileImage: 'https://miro.medium.com/max/1400/1*DW3-mBLhOOAFIFUVYUkgsQ.png', // eslint-disable-line
      title: 'Need help in grade 12 math',
      description: 'Need help on grade 12 calculus',
      images: [],
      keywords: ['calculus', 'grade', '12'],
      createdDate: new Date(),
      applicants: 2,
    },
    {
      id: 2,
      posterName: 'Soory',
      userId: '6jMsIXUrBHBj7o2cRlau',
      profileImage: 'https://www.americaspace.com/wp-content/uploads/2012/03/FaceShot.jpg', // eslint-disable-line
      title: 'Need help in differential equaitons',
      description: 'Need help on ordenery differential equations',
      images: [],
      createdDate: new Date(),
      applicants: 3,
    },
  ],
};

const getters = {
  questions: (state) => state.questions,
  getQuestion: (state) => (id) => {
    return state.questions.find((question) => question.id==id);
  },
};

const actions = {

};

const mutations = {

};

export default {
  state,
  getters,
  actions,
  namespaced: true,
  mutations,
};
