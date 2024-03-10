
<template>
  <div>
    <loading :active.sync="isLoading"/>
    <div v-if="!isLoading">
      <education-editor
        v-if="editorOpen"
        v-on:saveEvent="saveEvent"
        v-on:cancelEvent="cancelEvent"
      ></education-editor>
      <div class="flex-container-column">
        <div id="left-container">
          <h4 id="title"> Education </h4>
        </div>
        <div id="right-button-area">
          <button class="no-styling-button primary-color" id="add-education" v-on:click="add">
            <edit-icon :iconColor="'var(--clr-accent)'"/>
          </button>
        </div>
      </div>
      <div class="pt-1" v-if="profile && profile.institution">
        <div class="educationRow row">
          <div class="col-3">
            <education-icon :size="'70%'" :hoverExpand="false" :iconColor="'var(--clr-accent)'"/>
          </div>
          <div class="col my-auto">
            <p id="institution-name">{{profile.institution}}</p>
            <p id="degree">{{profile.degree}}</p>
            <p id="field-of-study">{{profile.fieldOfStudy}}</p>
            <p id="start-and-end-year">{{profile.startYear}}-{{profile.endYear}}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <div id="fall-back-text" class="center">
          {{educationFallBackText}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import EducationEditor from '@/components/profile/EducationEditor.vue';
import {Profile} from '@/api';
import {EditIcon, EducationIcon} from '@/components/icons';

export default {
  name: 'education',
  props: {
    profileId: String,
    fetchedProfile: Object,
  },
  data: function() {
    return {
      editorOpen: false,
      otherProfile: null,
    };
  },
  components: {'education-editor': EducationEditor, EditIcon, EducationIcon},
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    isLoggedInUser() {
      return this.currentProfile.id === this.profileId;
    },
    isLoading() {
      return this.profile === null;
    },
    educationFallBackText() {
      if (this.isLoggedInUser) {
        return 'Add your education to get more views on your profile';
      }

      return 'User has not added their education background';
    },
    profile() {
      if (this.isLoggedInUser) {
        return this.currentProfile;
      } else {
        return this.otherProfile;
      }
    },
  },
  methods: {
    ...mapActions('profile', ['setEducation']),
    cancelEvent() {
      this.editorOpen = false;
    },
    add() {
      this.editorOpen = true;
      this.editingIndex = null;
    },
    saveEvent(state) {
      this.editorOpen = false;
      this.saveItem(state);
    },
    saveItem({institution, degree, fieldOfStudy, startYear, endYear}) {
      this.setEducation(
          {institution, degree, fieldOfStudy, startYear, endYear},
      );
    },
  },
  async mounted() {
    if (!this.isLoggedInUser) {
      if (this.fetchedProfile) {
        this.otherProfile = this.fetchedProfile;
      } else {
        this.otherProfile = await Profile.ProfileService.get(this.profileId);
      }
    }
  },
};
</script>

<style scoped>
.center{
  display: flex;
  justify-content: center;
  align-content: center;
  text-align: center;
  flex-direction: column;
}

#fall-back-text{
  text-align: center;
  height: 3rem;
  background: var(--clr-gray-8);
  padding-top:1rem;
  padding-bottom: 1rem;
}

#left-container{
  flex: 1 1;
}

.flex-container-column{
  flex-direction: row;
  display:flex;
  flex-wrap: nowrap;
}

#add-education{
  margin-left: auto;
  margin-right: auto;
  color: var(--clr-primary-lighter);
  font-size: 2rem;
}

#institution-name{
  font-size: 1.3rem;
  margin-bottom: 0;
  color: var(--clr-gray-2)
}
#degree{
  font-size: 0.9rem;
  margin-bottom: 0;
  color: var(--clr-gray-3)
}
#field-of-study{
  font-size: 0.9rem;
  margin-bottom: 0;
  color: var(--clr-gray-3)
}
#start-and-end-year{
  font-size: 0.6rem;
  letter-spacing: 2px;
}

.institutionLogo{
  height: 5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.hover-to-show{
  visibility:hidden;
  opacity:0;
  transition:opacity 0.5s linear;
}
.educationRow:hover>.hover-to-show
{
  display:block;
  visibility:visible;
  opacity:1;
}

#title{
  color: var(--clr-primary);
  font-size: 2rem;
  font-weight: 400;
}
</style>
