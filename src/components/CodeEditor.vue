<template>
  <div class="h-100">
    <div id="monaco-editor" class="h-100"/>
  </div>
</template>

<script>
import * as Y from 'yjs';
import {WebrtcProvider} from 'y-webrtc';
import {MonacoBinding} from 'y-monaco';
import * as monaco from 'monaco-editor';

// @ts-ignore
window.MonacoEnvironment = {
  getWorkerUrl: function(moduleId, label) {
    if (label === 'json') {
      return '/monaco/dist/json.worker.bundle.js';
    }
    if (label === 'css') {
      return '/monaco/dist/css.worker.bundle.js';
    }
    if (label === 'html') {
      return '/monaco/dist/html.worker.bundle.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return '/monaco/dist/ts.worker.bundle.js';
    }
    return '/monaco/dist/editor.worker.bundle.js';
  },
};

export default {
  data: function() {
    return {
      editor: null,
      doc: null,
      provider: null,
      type: null,
      monacoBinding: null,
      language: 'javascript',
    };
  },
  mounted: function() {
    this.doc = new Y.Doc();
    this.provider = new WebrtcProvider('codemirror-demo-room', this.doc);
    this.type = this.doc.getText('monaco');
    this.editor = monaco.editor.create(
        document.getElementById('monaco-editor'),
        {
          value: '',
          language: this.language,
          theme: 'vs-dark',
        },
    );
    this.monacoBinding = new MonacoBinding(
        this.editor.getModel(),
        new Set([this.editor]), provider.awareness,
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
