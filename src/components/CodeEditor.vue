
<template>
  <div class="h-100">
    <div id="monaco-editor" ref="monacoEditor" class="h-100"/>
  </div>
</template>

<script>
import * as Y from 'yjs';
import {WebrtcProvider} from 'y-webrtc';
import {MonacoBinding} from 'y-monaco';
import * as monaco from 'monaco-editor';

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
      editor: null,
      type: null,
      monacoBinding: null,
      language: 'javascript',
    };
  },
  mounted: function() {
    const ytext = this.doc.getText('monaco');
    this.editor = monaco.editor.create(
        this.$refs['monacoEditor'],
        {
          value: '',
          language: this.language,
          theme: 'vs-dark',
        },
    );
    this.monacoBinding = new MonacoBinding(
        ytext,
        (this.editor.getModel()),
        new Set([this.editor]),
        this.provider.awareness,
    );
    this.provider.connect();
  },
};
</script>

<style>
#monaco-editor{
  text-align: left;
  height: 100%!important;
  width: 100%!important;
}
</style>
