<template>
  <div class="row h-100 w-100 m-0 p-0">
    <div class="col h-100 p-0">
      <code-editor :doc="doc" :provider="provider"></code-editor>
    </div>
    <div class="col h-100 p-0">
      <code-terminal :doc="doc" :provider="provider"></code-terminal>
    </div>
  </div>
</template>

<script>
import * as Y from 'yjs';
import {WebrtcProvider} from 'y-webrtc';
import CodeEditor from '@/components/code/CodeEditor.vue';
import CodeTerminal from '@/components/code/CodeTerminal.vue';

export default {
  name: 'code',

  components: {
    'code-editor': CodeEditor,
    'code-terminal': CodeTerminal,
  },

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

};
</script>

<style>

</style>
