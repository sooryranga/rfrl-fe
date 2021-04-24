<template>
  <vue-command
    :commands="commands"
    :is-in-progress="isInProgress"
    :history="history"
    :builtIn="builtIn"
    :executed="executed"
    :prompt="prompt"
    :hide-bar="hideBar"
    :show-help="true"
    @update:history="changeHistory"
    class="h-100"
  />
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import VueCommand, {createDummyStdout} from 'vue-command';
import CodeTerminalLoading from '@/components/code/CodeTerminalLoading.vue';
import 'vue-command/dist/vue-command.css';

export default {
  name: 'code-terminal',
  components: {
    VueCommand,
  },

  data: () => ({
    commands: {},
    prompt: '~tutorme@code:#/',
    isInProgress: false,
    hideBar: true,
    history: [],
    builtIn: undefined,
    executed: new Set(),
    terminate: false,
  }),

  computed: {
    ...mapGetters['conference', ['codeResult']],
  },

  watch: {
    codeResult(value) {
      console.log(value);
    },
  },

  methods: {
    ...mapActions('conference', ['setToRunning', 'setCodeResults']),
    changeHistory(history) {
      this.history = history;
    },
  },

  created() {
    this.commands.clear = () => {
      this.history = [];
      // Push dummy Stdout to show Stdin
      return createDummyStdout();
    };

    this.commands.run = () => {
      this.setToRunning();
      return CodeTerminalLoading;
    };
  },

  async mounted() {
    const sessionId = this.$route.params.sessionId;
    await this.setCodeResults({sessionId});
  },
};
</script>
