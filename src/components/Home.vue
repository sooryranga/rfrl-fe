<template>
  <div id="parent">
    <div class="m-5">
      <h1 id="logo">rfrl</h1>
      <h2 id="secondary"> Lets get started </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
};
</script>

<style scoped>
#parent{
  display: grid;
  height: 100%;
  width: 100%;
}
#logo{
  font-size: 6rem;
  font-weight: 400;
  color: var(--clr-primary);
}
#secondary{
  color: var(--clr-gray-4);
  font-weight: 300;
}
</style>
