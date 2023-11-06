<template>
  <div :v-if="profile.canBeTutor" id="review" class="shadow p-3 my-3 bg-white">
    <div class="row">
      <h3 class=" ml-4 my-2"> Student Review </h3>
    </div>
    <div class="mt-4" v-if="profile.tutorReviews">
      <div id="averageReview">
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col-4">
                <p> stars div </p>
              </div>
              <div class="col-5">
                <p> stars div</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr/>
      <div id="reviewList">
        <div v-for="review in profile.tutorReviews" v-bind:key="review.id" class="mb-3">
          <div id="reviewProfile" class="row">
            <div class="col-3 my-auto">
              <img v-bind:src="review.studentImage" class="studentImage"/>
            </div>
            <div class="col my-auto">
              <h5 class=" mb-1">{{review.studentName}}</h5>
            </div>
          </div>
          <div id="reviewStars" class="row">
            <div class="col-3">
              <p class="my-0">STARTS DIV</p>
            </div>
            <div class="col-4 ">
              <p class="my-0 font-weight-bold">{{review.title}}</p>
              <p class="my-0"><small>{{review.createdAt.toDateString()}}</small></p>
              <p class="my-0">{{review.description}}</p>
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
import {mapGetters, mapActions} from 'vuex';
import {TUTOR_REVIEW} from '@/constants.actions.js';
import {profileState} from '@/constants.state.js';

export default {
  name: 'tutor-reviews',
  props: {
    'profileId': String,
  },
  data: function() {
    return {
      profile: profileState(),
    };
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    'isLoggedInUser': function() {
      return this.currentProfile.id === this.profileId;
    },
  },
  methods: {
    ...mapActions('profile', [TUTOR_REVIEW]),
  },
  beforeMount: function() {
    if (this.isLoggedInUser) {
      this.profile = this.currentProfile;
    }
  },
  mounted: function() {
    if (this.isLoggedInUser) {
      this[TUTOR_REVIEW]();
    }
  },
};
</script>

<style>
.studentImage{
  background-size: cover;
  background-position: top center;
  border-radius:50%;
  background-color: #fff;
  height: 2.5vh;
  width: 2.5vh;
}
</style>
