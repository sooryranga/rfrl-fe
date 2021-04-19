<template>
  <vue-command :commands="commands" />
</template>

<script>
import VueCommand, {createStdout} from 'vue-command';
import 'vue-command/dist/vue-command.css';

export default {
  name: 'code-terminal',
  components: {
    VueCommand,
  },

  data: () => ({
    commands: {
      'hello-world': () => createStdout('Hello world'),
    },
  }),
};
</script>
