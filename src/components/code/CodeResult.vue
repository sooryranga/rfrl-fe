<template>
  <div>
    <div
      class="term-stdin-container">

      <slot name="prompt">
        <span
          v-if="!hidePrompt"
          class="term-ps">
          {{ prompt }}
        </span>
      </slot>

      <span class="term-stdin">
        <input
          ref="input"
          v-model="stdin"
          :autofocus="isLast"
          :disabled="!isLast || isInProgress"
          :placeholder="placeholder"
          type="text"
          autocorrect="off"
          autocapitalize="none"
          @keyup.enter.exact="handle"/>
      </span>
    </div>
    <div v-if="stdout" class="term-stdout">
      <pre>{{stdout}}</pre>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex';


export default {
  name: 'code-result',
  props: {
    isLast: Boolean,
    isInProgress: Boolean,
    resultId: String,
    prompt: {
      default: '',
      type: String,
    },
    showHelp: Boolean,
  },

  data() {
    return {
      stdin: '',
      stdout: '',
      hidePrompt: false,
      placeholder: 'run',
    };
  },

  computed: {
    result() {
      return this.$store.getters['conference/getCodeResult'](this.resultId);
    },
  },

  watch: {
    result(val) {
      console.log(val);
      this.stdin = val.stdin;
      this.stdout = val.stdout;
    },
  },

  methods: {
    ...mapActions('conference', ['runCode', 'addCodeResult', 'clear']),
    async handle() {
      const program = this.stdin.trim();

      switch (program) {
        case 'clear':
          await this.clear();
          break;
        case 'run':
          await this.runCode();
          break;
        case 'help':
          this.addCodeResult({
            stdin: 'help',
            stdout: `run - execute code written \nclear - clear all executed code from terminal`, //eslint-disable-line
          });
          break;
        default:
          this.addCodeResult({
            stdin: this.stdin,
            stdout: `Invalid program. Type 'help' to get all options`,
          });
      }
      this.stdin = '';
    },
    focus() {
      this.$refs.input.focus();
    },
    setPlaceholder(placeholder) {
      this.placeholder = placeholder;
    },
  },

  mounted() {
    setTimeout(() => {
      if (this.isLast && this.showHelp) {
        this.setPlaceholder(this.helpText);
      }
    }, 10);

    if (this.result) {
      this.stdin = this.result.stdin;
      this.stdout = this.result.stdout;
    }
  },
};
</script>

<style lang="scss">
.vue-command {

  .term-stdin-container {
    display: flex;
  }

  input,
  textarea {
    background: none;
    border: none;
    font-family: "Inconsolata", monospace;
    font-size: 1rem;
    outline: none;
    flex: 1;
    width: 100%;
  }

  .term-stdin {
    flex: 1;
    background: none;
    margin: 0;
    border: 0;
    color: inherit;
    font-family: inherit;
    font-size: 1rem;
  }

  .term-ps {
    margin-right: 0.5rem;
  }

  span,
  a,
  input,
  pre,
  textarea {
    color: #ffffff;
  }
}
</style>
