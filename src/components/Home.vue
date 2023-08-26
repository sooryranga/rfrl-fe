<template>
  <div id="parent">
    <div class="mx-auto my-auto text-center">
      <h1>Got questions? Get Answers.</h1>
      <h1><small class="text-muted">Your next favourite tutor is one message away!</small></h1>
      <div class="form-group">
        <router-link class="btn btn-outline-dark mr-lg-5" to="/questions">Ask Question</router-link>
        <router-link class="btn btn-outline-dark" to="/tutors">Find Tutor</router-link>
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
#parent{
  display: grid;
  height: 100%;
  width: 100%;
}
</style>
