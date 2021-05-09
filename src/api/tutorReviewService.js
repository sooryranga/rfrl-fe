import Vue from 'vue';

export const responseToTutorReview = (response) => {
  if (!response) return;

  const review = {...response};
  if (review.createdAt) {
    review.createdAt = new Date(review.createdAt);
  }

  if (review.updatedAt) {
    review.updatedAt = new Date(review.updatedAt);
  }

  return review;
};

export const TutorReviewService = {
  async get(id) {
    const response = await Vue.axios.get(`tutor-review/${id}/`);
    return responseToTutorReview(response.data);
  },
  async put({id, headline, review, stars}) {
    const response = await Vue.axios.put(
        `tutor-review/${id}/`,
        {headline, review, stars},
    );
    return responseToTutorReview(response.data);
  },
  async post({headline, review, stars, tutorId}) {
    const response = await Vue.axios.post(
        `tutor-review/`,
        {headline, review, stars, tutorId},
    );
    return responseToTutorReview(response.data);
  },
  async delete({id}) {
    await Vue.axios.delete(`tutor-review/${id}/`);
  },
  async getForTutor({tutorId}) {
    const response = await Vue.axios.get(`tutor-reviews/${tutorId}/`);
    const reviews = response.data;

    return reviews?.map((rev) => responseToTutorReview(rev)) || [];
  },
  async getAggregateForTutor({tutorId}) {
    const response = await Vue.axios.get(`tutor-reviews-aggregate/${tutorId}/`);
    return response.data;
  },
  async getPendingTutorReview() {
    const response = await Vue.axios.get(`pending-tutor-reviews/`);
    return response.data;
  },
};


export default {responseToTutorReview, TutorReviewService};
