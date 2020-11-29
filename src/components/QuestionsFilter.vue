<template>
  <div class="row justify-content-center">
    <div class="col-1 my-auto">
      <h4 class="m-0">Filters:</h4>
    </div>
    <div class="col-3">
      <multiselect
      v-model="checkedDatePosted" :options="datePosted" :searchable="false"
      :close-on-select="true" :show-labels="true"
      placeholder="Date Posted" label="name" track-by="name"
      :select-label="''">
      </multiselect>
    </div>
    <div class="col-3">
        <multiselect
        v-model="checkedTags" :options="tags" :multiple="true"
        :close-on-select="false" :clear-on-select="false"
        :preserve-search="false" placeholder="Search for tags"
        :select-label="''" :taggable="false"
        label="name" track-by="name" :preselect-first="true">
          <template slot="tag"><div></div></template>
          <template slot="selection" slot-scope="{ values, search, isOpen }">
            <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">
              Tags
            </span>
          </template>
        </multiselect>
    </div>
    <div class="col-2">
      <button
      class="btn"
      v-bind:class="[isRemote? 'btn-dark' : 'btn-outline-dark']"
      v-on:click="isRemote!=isRemote"
      @change="remoteChange">
      Online Tutoring
      </button>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import {datePosted, tags} from '@/utils.js';
console.log(datePosted);

export default {
  name: 'question-filter',
  data: function() {
    return {
      tags,
      datePosted,
      checkedTags: [],
      checkedDatePosted: datePosted[0],
      isRemote: false,
    };
  },
  components: {
    Multiselect,
  },
  methods: {
    tagChange: function(tag) {
      if (tag in this.checkedTags) {
        this.$emit('addTag', tag);
      } else {
        this.$emit('removeTag', tag);
      }
    },
    dateValueChanged: function() {
      this.$emit('updateDatePosted', this.checkedDatePosted);
    },
    remoteChange: function() {
      this.$emit('updateRemote', this.isRemote);
    },
  },
};
</script>


<style src = "vue-multiselect/dist/vue-multiselect.min.css">
</style>
