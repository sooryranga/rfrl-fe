<template>
  <div id="container">
    <div id="header">
      <h1 id="logo">rfrl</h1>
    </div>
    <div id="content">
      <p>Thanks for signing up.</p>
      <p>In progress of finding some talented engineers. We will email you once we find good match for you!</p>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style>
#container{
  padding-top: 5rem;
  height:100%;
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}
#header{
  flex: 0 0 5rem;
}

#logo{
  font-size: 6rem;
  font-weight: 400;
  color: var(--clr-primary);
}

#content{
  flex: 1 0;
  justify-content: center;
  margin: 0 auto;
  padding-top: 2rem;
  font-size: 1.1rem;
}
</style>
