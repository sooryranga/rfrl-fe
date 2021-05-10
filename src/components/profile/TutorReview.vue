<template>
  <div id="review" class="shadow p-3 my-3 bg-white">
    <div class="row">
      <h3 class=" ml-4 my-2"> Student Review </h3>
    </div>
    <div class="mt-4" v-if="tutorReviews.length">
      <div id="averageReview">
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col"
              v-for="(starType, index) in reviewStars(aggerateStars)"
              v-bind:key="index">
                <span class="material-icons stars">
                  {{starType}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr/>
      <div id="reviewList">
        <div v-for="review in tutorReviews" v-bind:key="review.id" class="mb-3">
          <div id="reviewProfile" class="row">
            <div class="col my-auto mx-auto">
              <img v-bind:src="review.from.photo" class="studentImage"/>
            </div>
            <div class="col-8 my-auto">
              <h5 class=" mb-1">{{review.from.firstName}} {{review.from.lastName}}</h5>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="row">
                <div class="col"
                v-for="(starType, index) in reviewStars(review.stars)"
                v-bind:key="index">
                  <span class="material-icons stars">
                    {{starType}}
                  </span>
                </div>
              </div>
            </div>
            <div class="col-8">
              <p class="my-0 font-weight-bold">{{review.headline}}</p>
              <p class="my-0"><small>{{review.createdAt.toDateString()}}</small></p>
              <p class="my-0">{{review.review}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4" v-else>
      <p> This tutor currently doesn't have any ratings </p>
      <p> Rest assured our tutors are verified </p>
    </div>
  </div>
</template>

<script>
import {TutorReview} from '@/api';

export default {
  name: 'tutor-reviews',
  props: {
    profileId: String,
  },
  computed: {
    aggerateStars() {
      const stars = this.aggregateReview.totalStars;
      const reviews = this.aggregateReview.totalReviewCount;
      return stars/reviews;
    },
  },
  data: function() {
    return {
      tutorReviews: [],
      aggregateReview: {
        totalStars: 0,
        totalReviewCount: 1,
      },
    };
  },
  methods: {
    reviewStars(stars) {
      const ratio = Math.ceil(stars);

      return [
        ...Array(ratio).fill('star'),
        ...Array(5-ratio).fill('star_border'),
      ];
    },
  },
  async mounted() {
    this.tutorReviews = await TutorReview.
        TutorReviewService.
        getForTutor({
          tutorId: this.profileId,
        });
    this.aggregateReview = await TutorReview.
        TutorReviewService.
        getAggregateForTutor({
          tutorId: this.profileId,
        });
  },
};
</script>

<style>
.studentImage{
  background-size: cover;
  background-position: top center;
  border-radius:50%;
  background-color: #fff;
  height: 4vh;
  width: 4vh;
}

.stars {
  width: 10px;
}
</style>
