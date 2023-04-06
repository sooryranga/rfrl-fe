<template>
<div>
    <div class="left">
        <div id="logo">
            <img v-bind:src="'/media/' + logo">
        </div>
        <tab>Home</tab>
        <tab>Ask Question</tab>
        <tab>Find tutor</tab>
        <tab>About</tab>
    </div>
    <div class="right">
        <div v-if="user">
            <tab></tab>
        </div>
        <div v-else>
            <tab>Sign Up</tab>
            <tab>
        </div>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    logo: String,
    user: Object
  }
}
</script>