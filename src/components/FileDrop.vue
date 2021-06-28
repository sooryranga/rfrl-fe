<template>
  <div
    :class="['file-drop', stateClasses]"
    @drop.prevent="onFileDrop"
    @dragover.prevent="dragover = true"
    @dragleave.prevent="dragover = false"
  >
      <slot name="content"></slot>

      <button
          v-if="showPickerButton"
          type="button"
          :class="['file-drop-button']"
          @click="openPicker"
      >
          <slot name="button"></slot>
      </button>

      <input
          type="file"
          ref="input"
          v-bind="$attrs"
          enctype="multipart/form-data"
          :multiple="multiple"
          :accept="acceptTypes"
          :style="{ display: 'none' }"
          @change="onFileUpload"
      />
</div>
</template>

<script>
export default {
  name: 'file-drop',
  inheritAttrs: false,

  model: {
    prop: 'model',
    event: 'change',
  },

  props: {
    model: {
      type: Array,
      required: true,
    },
    pickerTrigger: {}, // event
    showPickerButton: Boolean,
    disabled: Boolean,
    multiple: Boolean,
    accept: [String, Array],
  },

  data: (vm) => ({
    dragover: false,
    files: [],
    localValue: vm.model,
  }),

  computed: {
    stateClasses() {
      return {
        'disabled': this.disabled,
        'dragover': this.dragover,
      };
    },
    acceptTypes() {
      const types = this.accept;

      return Array.isArray(types) ? types.join(',') : types;
    },
  },

  watch: {
    pickerTrigger() {
      this.openPicker();
    },
  },

  methods: {
    onFileDrop($event) {
      const droppedFiles = $event.dataTransfer.files;

      if (!droppedFiles) {
        return;
      };

      this.dragover = false;

      this.addFiles(droppedFiles);
    },

    onFileUpload($event) {
      const fileList = $event.target.files;

      this.addFiles(fileList);
    },

    openPicker() {
      this.$refs.input.click();
    },

    addFiles(fileList) {
      // convert FileList to array
      const files = [...fileList];

      if (this.multiple) {
        files.forEach((file) => this.localValue.push(file));
      } else {
        this.localValue = [files[0]];
      }

      this.$emit('change', this.localValue);
    },
  },
};
</script>

<style lang="scss" scoped>
// COMPONENT

$theme: (
  'primary': #68d391,
  'background': #edf2f7,
);

.file-drop {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 180px;
    background-color: var(--clr-primary);
    color: white;
    transition: background-color 160ms ease;

    &.dragover {
        background-color: lighten(map-get($theme, 'primary'), 32%);
    }
}

.file-drop p {
  color: white;
}
</style>
