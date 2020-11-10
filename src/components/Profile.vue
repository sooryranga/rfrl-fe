<template>
  <div class="row">
    <div class="col-7">
      <div id="profileheader" class="shadow p-3 my-3 mt-5 pb-5 bg-white">
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
      <div v-if="profileEducation" id="education" class="shadow p-3 my-3 bg-white">
        <h3 class="text-left"> Education </h3>
        <div v-for="education in profileEducation" v-bind:key="education.id">
          <div class="row">
            <div class="col-3">
              <p>{{education.institution}}</p>
            </div>
            <div class="col-6">
              <p>{{education.institutionName}}</p>
              <p>{{education.degree}}</p>
              <p>{{education.fieldOfStudy</p>
              <p><small>{{education.start}}-{{education.end}}</small></p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="profileDocuments" id="documents" class="shadow p-3 my-3 bg-white">
        <div class="card-columns">
          <div v-for="document in profileDocuments" v-bind:key="document.name" class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">{{document.name}}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{document.type}}</h6>
              <p class="card-text">
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </p>
              <a href="#" class="card-link">Card link</a>
              <a href="#" class="card-link">Another link</a>
            </div>
          </div>
        </div>
      </div>
      <div :v-if="profile.isTutor" class="shadow p-3 my-1 bg-white">
        <h3> Tutoring Dashboard </h3>
        <div id="tutorStatus">
          <!-- Chart showing previous tutoring session -->
        </div>
        <div id="previousStudentProfiles">
         <ul class="list-group">
            <li class="list-group-item">
              <div id="studentPreview">
                <div class="row">
                  <div class="col-3">
                    <img class="studentPicture float-left"/>
                  </div>
                  <div class="col">
                    <h5 class="text-left">Student Name</h5>
                    <p class="text-left"><small>Last tutored Date</small></p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div :v-if="profile.isTutor" id="review" class="shadow p-3 my-3 bg-white">
        <div id="averageReview">
          <h3> Student Review </h3>
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
import {mapGetters} from 'vuex';

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
};
</script>

<style>
.profilePicture{
  background-size: cover;
  background-position: top center;
  border-radius: 50%;
  background-color: #fff;
  padding: 4px;
}
</style>
