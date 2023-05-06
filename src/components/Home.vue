<template>
<div class="vertical-center h-100" id="parent">
  <div class="container">
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
.vertical-center {
  /* Make it a flex container */
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;

  min-height:80vh;

  /* Align the bootstrap's container vertically */
    -webkit-box-align : center;
  -webkit-align-items : center;
       -moz-box-align : center;
       -ms-flex-align : center;
          align-items : center;

  /* In legacy web browsers such as Firefox 9
     we need to specify the width of the flex container */
  width: 100%;
  height: 100%;

  /* Also 'margin: 0 auto' doesn't have any effect on flex items in such web browsers
     hence the bootstrap's container won't be aligned to the center anymore.

     Therefore, we should use the following declarations to get it centered again */
         -webkit-box-pack : center;
            -moz-box-pack : center;
            -ms-flex-pack : center;
  -webkit-justify-content : center;
          justify-content : center;
}
</style>
