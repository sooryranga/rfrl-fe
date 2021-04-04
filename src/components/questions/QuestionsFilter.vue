<template>
  <div class="row justify-content-center">
    <div class="col-2 my-auto">
      <h5 class="m-0">Filters:</h5>
    </div>
    <div class="col-3">
      <multiselect
      v-model="checkedDatePosted" :options="datePosted" :searchable="false"
      :close-on-select="true" :show-labels="true" :deselect-label="''"
      @close="updatedAtPosted"
      placeholder="Date Posted" label="name" track-by="name"
      :select-label="''">
      </multiselect>
    </div>
    <div class="col-3">
        <multiselect
        v-model="checkedTags" :options="tags" :multiple="true"
        :close-on-select="false" :clear-on-select="false"
        :preserve-search="false" placeholder="Search for tags"
        :select-label="''" :taggable="false" :deselect-label="''"
        @remove="changeTag" @select="changeTag" @close="updateTag"
        label="name" track-by="name" :preselect-first="false">
          <template slot="tag"><div></div></template>
          <template slot="selection" slot-scope="{ values, isOpen }">
            <span
            class="multiselect__single"
            v-if="values.length &amp;&amp; !isOpen">
              Tags ({{values.length}})
            </span>
          </template>
        </multiselect>
    </div>
    <div class="col-2">
      <button
      class="btn h-100 shadow-none"
      v-bind:class="[isRemote? 'btn-dark' : 'btn-outline-dark']"
      v-on:click="updateRemote"
      >
      Online Tutoring
      </button>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import {datePosted, tags, datePostedKeyValue, tagKeyValue} from '@/utils.js';

export default {
  name: 'question-filter',
  data: function() {
    return {
      tags,
      datePosted,
      checkedTags: [],
      checkedDatePosted: datePosted[0],
      isRemote: false,
      changedTags: false,
    };
  },
  components: {
    Multiselect,
  },
  methods: {
    changeTag: function() {
      this.changedTags = true;
    },
    updateTag: function() {
      if (!this.changedTags) {
        return;
      }
      const keys= this.checkedTags.map((v) => v.key);
      const mergedQuery = {...this.$route.query, checkedTag: keys};
      this.$router.push({query: mergedQuery});
      this.$emit('updateTag', this.checkedTags);
      this.changedTags = false;
    },
    updatedAtPosted: function() {
      const mergedQuery = {
        ...this.$route.query,
        checkedDatePosted: this.checkedDatePosted.key,
      };
      this.$router.push({query: mergedQuery});
      this.$emit('updatedAtPosted', this.checkedDatePosted);
    },
    updateRemote: function() {
      this.isRemote = !this.isRemote;
      const mergedQuery = {
        ...this.$route.query,
        isRemote: this.isRemote,
      };
      this.$router.push({query: mergedQuery});
      this.$emit('updateRemote', this.isRemote);
    },
  },
  mounted: function() {
    let tagKeys = this.$route.query?.checkedTag || [];
    if (typeof tagKeys === 'string') {
      tagKeys = [tagKeys];
    }
    for (const key of tagKeys) {
      if (key in tagKeyValue) {
        this.checkedTags.push(tagKeyValue[key]);
      }
    }
    const datePostedKey = this.$route.query?.checkedDatePosted;
    if (datePostedKey && datePostedKey in datePostedKeyValue) {
      this.checkedDatePosted = datePostedKeyValue[datePostedKey];
    }

    const isRemote = this.$route.query?.isRemote;
    if (isRemote == 'true') {
      this.isRemote = true;
    }
  },
};
</script>


<style src = "vue-multiselect/dist/vue-multiselect.min.css">
.selected{
  background-color: #343a40;
  border-color: #343a40;
}
</style>
