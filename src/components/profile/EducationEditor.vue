<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-dialog modal-dialog-centered" role="education">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Education Edit</h5>
            <button v-on:click="cancel" type="button"
            class="no-styling-button" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-2">
                <p>Institution</p>
              </div>
              <div class="col">
                <input class="w-100" v-model="institution" placeholder="Institution name?">
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <p>Degree</p>
              </div>
              <div class="col">
                <input class="w-100" v-model="degree" placeholder="Whats the degree?">
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <p>Field of Study</p>
              </div>
              <div class="col">
                <input clas="w-100" v-model="fieldOfStudy" placeholder="Whats the field of study?" />
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <p>Start Year</p>
              </div>
              <div class="col">
                <datepicker
                  v-model="start"
                  :format="'yyyy'"
                  :minimumView="'year'"
                  :maximumView="'year'"
                  :initialView="'year'">
                </datepicker>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <p>End Year</p>
              </div>
              <div class="col">
                <datepicker
                  v-model="end"
                  :minimumView="'year'"
                  :format="'yyyy'"
                  :maximumView="'year'"
                  :initialView="'year'">
                </datepicker>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="cancel" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" v-on:click="save" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex';
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'education-editor',
  props: {
    educationprop: Object,
  },
  components: {
    Datepicker,
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    startYear() {
      return this.start?.getFullYear();
    },
    endYear() {
      return this.end?.getFullYear();
    },
  },
  data: function() {
    return {
      institution: null,
      degree: null,
      fieldOfStudy: null,
      start: null,
      end: null,
    };
  },
  methods: {
    save: function() {
      // Save file to bucket and update src
      const state = {
        institution: this.institution,
        degree: this.degree,
        fieldOfStudy: this.fieldOfStudy,
        startYear: this.startYear,
        endYear: this.endYear,
      };
      this.$emit(
          'saveEvent',
          state,
      );
    },
    cancel: function() {
      this.$emit(
          'cancelEvent',
      );
    },
  },
  mounted: function() {
    this.institution = this.currentProfile.institution || '';
    this.degree = this.currentProfile.degree || '';
    this.fieldOfStudy = this.currentProfile.fieldOfStudy || '';
    this.start = this.currentProfile.startYear?
      new Date(this.currentProfile.startYear, 0, 1): null;
    this.end = this.currentProfile.endYear ?
      new Date(this.currentProfile.endYear, 0, 1): null;
  },
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>
