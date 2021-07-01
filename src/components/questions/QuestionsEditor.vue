<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-dialog modal-lg" role="question">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">{{questionEditorTitle}}</h5>
            <button v-on:click="cancel" type="button"
            class="no-styling-button" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="mb-2">
              <div class="form-row">
                <label class="col-form-label">Title</label>
              </div>
              <div class="form-row">
                <div class="col">
                  <input
                    class="w-100 form-control"
                    :class="{ 'is-invalid': $v.title.$error }"
                    v-model.trim="$v.title.$model"
                    placeholder="title of the question?"/>
                </div>
              </div>
              <div class="error row" v-if="$v.title.$error && !$v.title.required">
                <div class="col text-danger">
                  <small>Title is required</small>
                </div>
              </div>
              <div class="error row" v-if="$v.title.$error && !$v.title.minLength">
                <div class="col text-danger">
                  <small>Title must have at least {{$v.title.$params.minLength.min}} letters.</small>
                </div>
              </div>
            </div>
            <div class="my-2">
              <div class="form-row">
                <label class="col-2 col-form-label">Description</label>
              </div>
              <div class="form-row">
                <div class="col">
                  <editor
                    :initialValue="description"
                    :options="editorOptions"
                    ref="mdEditor"
                    height="500px"
                  />
                </div>
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
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import {Editor} from '@toast-ui/vue-editor';

import {mapGetters, mapActions} from 'vuex';
import {required, minLength} from 'vuelidate/lib/validators';

export default {
  validations: {
    title: {
      required,
      minLength: minLength(25),
    },
  },
  components: {
    editor: Editor,
  },
  computed: {
    ...mapGetters('questions', ['editorQuestion']),
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
      submitStatus: null,
      editorOptions: {
        usageStatistics: false,
        hooks: {
          addImageBlobHook(blob, callback) {
            const fileUpload = (blob) => {
              const formData = new FormData();
              formData.append('file', blob);
              // api.post('my server', formData).then(
              //     (res) => {
              //       callback.call('[image]', 'my server'+res.data.file);
              //     },
              //     () => alert('Did not work'),
              // );
            };
            fileUpload(blob, callback);
            return true;
          },
        },
      },
    };
  },
  methods: {
    ...mapActions('questions', ['closeEditor', 'createQuestion']),
    getMarkDown() {
      return this.$refs.mdEditor.invoke('getMarkdown');
    },
    cancel() {
      this.closeEditor();
    },
    async save() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const payload = {
          title: this.title,
          body: this.getMarkDown(),
        };
        const saved = await this.createQuestion(payload);

        if (saved) {
          this.closeEditor();
        }
      }
    },
  },
  mounted: function() {
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
