<template>
  <div>
    <div class="row">
      <div class="col mx-3">
        <label>Referral Companies</label>
      </div>
    </div>
    <div class="row">
      <div class="col mx-3">
        <multiselect
        v-model="checkedCompanies" :options="companies" :multiple="true"
        :close-on-select="false" :clear-on-select="false"
        :preserve-search="false" placeholder="Search for Companies"
        :select-label="''" :taggable="false" :deselect-label="''"
        @remove="changeCompany" @select="changeCompany" @close="updatedCompany"
        label="name" track-by="name" :preselect-first="false">
          <template slot="tag"><div></div></template>
          <template slot="selection" slot-scope="{ values, isOpen }">
            <span
            class="multiselect__single"
            v-if="values.length &amp;&amp; !isOpen">
              Companies ({{values.length}})
            </span>
          </template>
        </multiselect>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import Multiselect from 'vue-multiselect';

export default {
  name: 'question-filter',
  data: function() {
    return {
      checkedCompanies: [],
      changedCompanies: false,
    };
  },
  computed: {
    ...mapGetters('companies', ['companies']),
  },
  components: {
    Multiselect,
  },
  methods: {
    ...mapActions('companies', ['getCompanies']),
    changeCompany: function() {
      this.changedCompanies = true;
    },
    updatedCompany: function() {
      if (!this.changedCompanies) {
        return;
      }
      // filter with checkedCompanies
      this.changedCompanies = false;
    },
  },
  mounted: function() {
    this.getCompanies();
  },
};
</script>


<style src = "vue-multiselect/dist/vue-multiselect.min.css">
.selected{
  background-color: #343a40;
  border-color: #343a40;
}
</style>
