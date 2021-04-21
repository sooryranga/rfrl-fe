<template>
  <div>
    <span>{{ "#".repeat(index) }}</span>
  </div>
</template>

<script>
export default {
  inject: ['terminate', 'setStdin'],

  data: () => ({
    index: 0,
  }),

  created() {
    this.setStdin('arun');
  },

  mounted() {
    if (this.context.parsed.help) {
      this.terminate();
      return;
    }
    console.log(this.context);
    console.log(this.setStdin);


    const timeout = this.context.parsed.timeout || 50;
    const amount = this.context.parsed.amount || 10;

    const load = () =>
      setTimeout(() => {
        this.index++;
        if (this.index < amount) {
          load();
        } else {
          this.terminate();
        }
      }, timeout);

    load();
  },
};
</script>
