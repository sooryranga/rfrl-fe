
<template>
  <div class="h-100">
    <div id="monaco-editor" ref="monacoEditor" class="h-100"/>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import * as Y from 'yjs';
import {WebrtcProvider} from 'y-webrtc';
import {MonacoBinding} from 'y-monaco';
import * as monaco from 'monaco-editor';

export default {
  name: 'code-edutor',
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
  computed: {
    ...mapGetters('conference', ['runCode']),
  },
  watch: {
    async runCode(value) {
      if (value === true) {
        const code = this.editor.getValue();
        const sessionId = this.$route.params.sessionId;

        await this.submitCode({
          code,
          sessionId,
          language: 'javascript',
        });
      }
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
  methods: {
    ...mapActions('conference', ['submitCode']),
  },
  mounted: function() {
    const ytext = this.doc.getText('monaco');
    this.editor = monaco.editor.create(
        this.$refs['monacoEditor'],
        {
          value: '',
          language: this.language,
          theme: 'vs',
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

<style scoped>
#monaco-editor{
  text-align: left;
  height: 100%!important;
  width: 100%!important;
}
</style>
