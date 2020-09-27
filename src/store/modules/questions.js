const state = {
  questions: [
    {
      id: 1,
      poster: 'Arun',
      description: 'Need help on grade 12 calculus',
      images: [],
      keywords: ['calculus', 'grade', '12'],
    },
    {
      id: 2,
      poster: 'Soory',
      description: 'Need help on ordenery differential equations',
      images: [],
    },
    {
      id: 3,
      poster: 'Soory2',
      description: 'Need help on ordenery differential equations',
      images: [],
    },
  ],
};

const getters = {
  questions: (state) => state.questions,
};

const actions = {

};

const mutations = {

};

export default {
  state,
  getters,
  actions,
  mutations,
};
