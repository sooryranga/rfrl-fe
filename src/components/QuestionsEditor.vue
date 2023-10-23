<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-dialog modal-dialog-centered" role="question">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">{{questionEditorTitle}}</h5>
            <button v-on:click="cancel" type="button" class="close" data-dismiss="modal" aria-label="Close">
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
import {mapGetters, mapActions} from 'vuex';

export default {
  computed: {
    ...mapGetters('questions', ['isEditorOpen', 'editorQuestion']),
    questionEditorTitle: function() {
      if (this.editorQuestion === null) {
        return 'Create Question';
      }
      return 'Modify Question';
    },
  },
  methods: {
    ...mapActions('questions', ['closeEditor']),
    cancel() {
      this.closeEditor();
    },
  },
};
</script>
