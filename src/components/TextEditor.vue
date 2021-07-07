<template>
  <div class="h-100">
    <div ref="editor" id="editor">
    </div>
  </div>
</template>

<script>
import * as Y from 'yjs';
import {WebrtcProvider} from 'y-webrtc';
import {QuillBinding} from 'y-quill';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';

Quill.register('modules/cursors', QuillCursors);

export default {
  props: {
    doc: {
      type: Y.Doc,
      required: true,
    },
    provider: {
      type: WebrtcProvider,
      required: true,
    },
  },
  data: function() {
    return {
      type: null,
      quillEditor: null,
      binding: null,
    };
  },
  mounted: function() {
    this.type = this.doc.getText('quill');

    this.quillEditor = new Quill(this.$refs.editor, {
      modules: {
        cursors: true,
        toolbar: [
          [{header: [1, 2, false]}],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block'],
        ],
        history: {
          userOnly: true,
        },
      },
      placeholder: 'Start collaborating...',
      theme: 'snow', // or 'bubble'
    });
    console.log(this.quillEditor);
    this.binding = new QuillBinding(
        this.type,
        this.quillEditor,
        this.provider.awareness,
    );
  },
};
</script>

<style scoped>
#editor{
  height:100%;
}
</style>

<style>
.ql-container.ql-snow {
    height: auto;
}
.ql-editor {
  max-height: 80vh;
  overflow-y: scroll;
}
</style>
