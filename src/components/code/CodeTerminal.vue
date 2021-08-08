<template>
  <div
    ref="vue-command"
    class="vue-command">

    <slot name="bar">
      <div
        v-if="!hideBar"
        class="term-bar">
        <span
          v-if="!hideTitle"
          class="term-title">
          {{ title }}
        </span>
      </div>
    </slot>

    <div
      ref="term-std"
      class="term-std">

      <div
        ref="term-cont"
        class="term-cont"
        @click="focus">

        <div
          v-for="(id, index) in codeResultIds"
          :key="id"
          class="term-hist">
          <code-result
            :isInProgress="(index === history.length - 1 && isInProgress)"
            :isLast="false"
            :prompt="prompt"
            :resultId="id"
            class="term-stdout"/>
        </div>

        <code-result
            ref="code-result"
            v-show="!isInProgress"
            :isLast="true"
            :prompt="prompt"
            :show-help="history.length === 0"
            :help-text="helpText"
            class="term-stdout"/>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import CodeResult from '@/components/code/CodeResult.vue';
import 'vue-command/dist/vue-command.css';

export default {
  name: 'code-terminal',
  components: {
    CodeResult,
  },

  computed: {
    ...mapGetters('conference', ['codeResultIds']),
  },

  data: () => ({
    commands: {},
    prompt: '~rfrl@code:#/',
    isInProgress: false,
    hideBar: true,
    builtIn: undefined,
    executed: new Set(),
    terminate: false,
    history: [],

    helpText: 'Type help',

    scroll: {
      eventListener: undefined,
      // Determinates if scolled to bottom
      isBottom: true,
      resizeObserver: undefined,
    },
  }),

  methods: {
    ...mapActions('conference', ['setCodeResults']),
    focus() {
      // If user selected any text skip setting
      // focus as otherwise the selection gets removed
      if (window.getSelection().toString() !== '') return;

      // Latest Stdin is latest history entry
      const stdin = this.$refs['code-result'];
      // Call component method
      stdin.focus();
    },
  },

  async mounted() {
    const sessionId = this.$route.params.sessionId;
    await this.setCodeResults({sessionId});

    // Scroll to bottom if Stdout mutates terminal height
    this.scroll.resizeObserver = new ResizeObserver(async (event) => {
      await this.$nextTick();

      // Only scroll to bottom if it was scrolled to bottom before
      if (this.scroll.isBottom && this.$refs['term-std']?.scrollHeight) {
        this.$refs['term-std'].scrollTop = this.$refs['term-std'].scrollHeight;
      }
    });

    this.scroll.resizeObserver.observe(this.$refs['term-cont']);

    // Check if scrolled to bottom
    this.scroll.eventListener = () => {
      const terminal = this.$refs['term-std'];
      this.scroll.isBottom = (
        terminal.scrollHeight - terminal.scrollTop - terminal.clientHeight
      ) === 0;
    };

    this.$refs['term-std'].addEventListener(
        'scroll',
        this.scroll.eventListener,
    );
  },
};
</script>

<style lang="scss">
$background: #111;

.vue-command {
  display: block;
  height: 100%;
  flex: 1;

  .term-bar {
    background: $background;
    border-bottom: 1px solid #252525;
    display: block;
    height: 32px;
    justify-content: center;
    top: 0;
    width: 100%;
    display: flex;
  }

  .term-title {
    font-family: "Montserrat", sans-serif;
    font-size: 0.85rem;
    margin: auto 0;
  }

  .term-std {
    background: $background;
    display: block;
    flex-direction: column;
    width: 100%;
    border: 0px solid $background;
    height: auto !important;
    min-height: 100%;

    @extend .term-hist-container-fullscreen;
  }

  .term-cont {
    font-family: "Inconsolata", monospace;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-bottom: 0.5rem;
    flex: 1;
    margin-top: 10px;
  }

  .term-hist-container-fullscreen {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
  }

  .term-stdout {
    word-break: break-all;
  }
}
#terminal-container{
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    overflow-y: auto;
  }
</style>
