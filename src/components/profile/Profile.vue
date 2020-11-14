<template>
  <div class="row w-75 mx-auto">
    <div class="col-7 overflowContainer">
      <div class="shadow p-3 my-3 bg-white">
        <div class="row">
          <div class="col-3">
            <img class="profilePicture" v-bind:src="profile.profileImage"/>
            <div v-if="bookTutorButton">
              <router-link class="btn btn-dark p-2 mr-2"  :to="bookTutorRoute">Book Tutor</router-link>
            </div>
          </div>
          <div class="col-6">
            <h3 class="text-left">{{profile.name}}</h3>
            <h4 class="text-left text-uppercase"> About </h4>
            <p class="text-left">{{profile.about}}</p>
          </div>
        </div>
      </div>
      <education v-bind:profile-id="$route.params.userId"></education>
      <documents v-bind:profile-id="$route.params.userId"></documents>
      <div :v-if="profile.isTutor" class="shadow p-3 my-1 bg-white">
        <h3 class="text-left ml-4 my-2"> Tutoring Dashboard </h3>
        <div id="tutorStatus">
          <!-- Chart showing previous tutoring session -->
        </div>
        <div id="previousStudentProfiles">
          <div id="studentPreview">
            <div v-for="student in profile.tutoredStudents" v-bind:key="student.profileId" class="row mb-2">
              <div class="col-3 my-auto">
                <img v-bind:src="student.image" class="studentPicture"/>
              </div>
              <div class="col my-auto">
                <h5 class="text-left mb-1">{{student.name}}</h5>
                <p class="text-left mb-0"><small>{{student.lastTutoredDate.toDateString()}}</small></p>
                <hr class="my-0"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div :v-if="profile.isTutor" id="review" class="shadow p-3 my-3 bg-white">
        <div id="averageReview">
          <h3 class="text-left ml-4 my-2"> Student Review </h3>
          <div class="row">
            <div class="col-4">
              <p> stars div </p>
            </div>
            <div class="col-5">
              <p> stars div</p>
            </div>
          </div>
        </div>
        <div id="reviewList">
          <ul class="list-group">
            <li class="list-group-item">
              <div class="row">
                <div class="col-3">
                  <p>Stars div</p>
                </div>
                <div class="col-6">
                  <p>review description</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col">
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {TUTORED_STUDENTS, DOCUMENTS} from '@/constants.actions.js';

export default {
  name: 'tutor',
  computed: {
    ...mapGetters('profile', ['getProfile']),
    'profile': function() {
      if (this.$route.params.userId == this.getProfile.id) {
        return this.getProfile;
      } else {
        return this.getProfile;
      }
    },
    'bookTutorRoute': function() {
      return {
        name: 'Calendar',
        params: {userId: this.profile.id},
      };
    },
    'currentProfile': function() {
      return this.getProfile;
    },
    'bookTutorButton': function() {
      return this.profile.isTutor &&
      (this.profile.id === this.currentProfile.id);
    },
  },
  methods: {
    ...mapActions('profile', [TUTORED_STUDENTS, DOCUMENTS] ),
  },
  mounted: function() {
    this[TUTORED_STUDENTS]();
  },
};
</script>

<style>
.profilePicture{
  background-size: cover;
  background-position: top center;
  border-radius: 50%;
  background-color: #fff;
  padding: 4px;
  height: 5vh;
  width: 5vh;
}
.studentPicture{
  background-size: cover;
  background-position: top center;
  border-radius:50%;
  background-color: #fff;
  height: 5vh;
  width: 5vh;
}
.overflowContainer{
  max-height:93vh;
  overflow-y:scroll;
}
</style>
