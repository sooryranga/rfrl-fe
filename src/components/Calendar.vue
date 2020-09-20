<template>
<div class='container'>
  <div class='container h-100 mt-0'>
    <div class='row h-100'>
      <div class='col col-3 p-0'>
        <div>
          <p> {{$route.params.user_id}} </p>
        </div>
      </div>
      <div class='col'>
        <v-app id="dayspan" v-cloak>
          <calendar-extension :calendar="calendar"></calendar-extension>
        </v-app>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Calendar } from 'dayspan'

export default {
  name: 'calendar',
  data: function () {
    return {
      calendar: Calendar.weeks()
    }
  },
  computed: mapGetters(['currentUser']),
  methods:{
  }
}
</script>

<style scoped>
.selectable{list-style-type: none;}
.selectablerows{ border-top: 0px; border-left: 0px; border-right: 0px;}
.selectablerows.ui-selecting { background: #93969a; }
.selectablerows.ui-selected { border-bottom:0px }
.scheduled{background: #3a3b3d; color:white}
</style>