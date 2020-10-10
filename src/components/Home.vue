<template>
<div class="d-flex flex-column">
  <div class="d-flex align-items-center">
    <div>
      <h1>Got questions? Get Answers.</h1>
      <h1><small class="text-muted">Your next favourite tutor is one message away!</small></h1>
      <div class="form-group">
        <router-link class="btn btn-outline-dark mr-lg-5" to="/questions">Ask Question</router-link>
        <router-link class="btn btn-outline-dark" to="/tutors">Find Tutor</router-link>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
</style>
