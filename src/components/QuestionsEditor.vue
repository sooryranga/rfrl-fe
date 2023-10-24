<template>
  <transition name="modal">
    <div v-if="isEditorOpen" class="modal-mask">
      <div class="modal-dialog modal-lg" role="question">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">{{questionEditorTitle}}</h5>
            <button v-on:click="cancel" type="button" class="close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="my-2">
              <div class="error row" v-if="!$v.title.required">
                <div class="col text-danger">
                  Title is required
                </div>
              </div>
              <div class="error row" v-if="!$v.title.minLength">
                <div class="col text-danger">
                  Title must have at least {{$v.title.$params.minLength.min}} letters.
                </div>
              </div>
              <div class="form-row">
                <label class="col-2 col-form-label">Title</label>
                <div class="col">
                  <input
                    class="w-100 form-control"
                    :class="{ 'is-invalid': $v.title.$error }"
                    v-model.trim="$v.title.$model"
                    placeholder="title of the question?"/>
                </div>
              </div>
            </div>
            <div class="my-2">
              <div class="error row" v-if="!$v.description.required">
                <div class="col text-danger">
                  Description is required
                </div>
              </div>
              <div class="form-row">
                <label class="col-2 col-form-label">Description</label>
                <div class="col">
                  <input
                    class="w-100 form-control"
                    :class="{ 'is-invalid': $v.description.$error }"
                    v-model.trim="$v.description.$model"
                    placeholder="explain your question"/>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <p>Images</p>
              </div>
              <div class="col">
                <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
              </div>
            </div>
          </div>
          <div class="form-group">
            <button class="button" @click="$v.$reset">$reset</button>
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
import {required, minLength} from 'vuelidate/lib/validators';

export default {
  validations: {
    title: {
      required,
      minLength: minLength(25),
    },
    description: {
      required,
    },
  },
  watch: {
    isEditorOpen: function() {
      this.$v.$reset();
    },
  },
  computed: {
    ...mapGetters('questions', ['isEditorOpen', 'editorQuestion']),
    questionEditorTitle: function() {
      if (this.editorQuestion === null) {
        return 'Create Question';
      }
      return 'Modify Question';
    },
  },
  data: function() {
    return {
      title: '',
      description: '',
      images: [],
    };
  },
  methods: {
    ...mapActions('questions', ['closeEditor', 'createQuestion']),
    cancel() {
      this.$v.$reset();
      this.closeEditor();
    },
    save() {
      this.$v.$reset();
      if (this.title === '' || this.description === '') {

      }
    },
  },
  mounted: function() {
    this.$v.$reset();
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
