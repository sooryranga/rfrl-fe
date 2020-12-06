<template>
<div class='mt-3 h-100'>
  <div class='row h-100'>
    <div class='col-3 p-0'>
      <div>
        <p> {{$route.params.userId}} </p>
      </div>
    </div>
    <div class='col' id="calendar">
   </div>
  </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'calendar',
  data: function() {
    return {
    };
  },
  mounted() {},
  computed: mapGetters(['currentUser']),
};
</script>

<style scoped>
.selectable{list-style-type: none;}
.selectablerows{ border-top: 0px; border-left: 0px; border-right: 0px;}
.selectablerows.ui-selecting { background: #93969a; }
.selectablerows.ui-selected { border-bottom:0px }
.scheduled{background: #3a3b3d; color:white}

#calendar{
  height: calc(100% - 80px);
}
</style>
