<template>
  <v-container class="h-100">
    <v-row class="h-100">
      <v-col class="mx-auto my-auto text-center">
        <h1>Got questions? Get Answers.</h1>
        <h1><small class="text-muted">Your next favourite tutor is one message away!</small></h1>
        <div class="form-group">
          <v-btn class="mr-5" to="/questions">Ask Question</v-btn>
          <v-btn to="/tutors">Find Tutor</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
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
