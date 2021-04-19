<template>
  <div class="row h-100 w-100">
    <div class="col h-100">
      <code-editor :doc="doc" :provider="provider"></code-editor>
    </div>
    <div class="col h-100">
      <code-terminal :doc="doc" :provider="provider"></code-terminal>
    </div>
</template>

<script>
import CodeEditor from '@/components/code/CodeEditor.vue';
import CodeTerminal from '@/components/code/CodeTerminal.vue';
import CodeTerminal from '../CodeTerminal.vue';

export default {
  components: {
    'code-editor': CodeEditor,
    'code-terminal': CodeTerminal
    CodeTerminal,
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
