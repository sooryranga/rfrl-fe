<template>
  <div class="row justify-content-center">
    <div class="col-3">
      <multiselect
      v-model="checkedPrice" :options="tutorPrice" :searchable="false"
      :close-on-select="true" :show-labels="true" :deselect-label="''"
      @close="updatedPrice"
      placeholder="Price" label="name" track-by="name"
      :select-label="''">
      </multiselect>
    </div>
    <div class="col-3">
        <multiselect
        v-model="checkedCompanies" :options="companies" :multiple="true"
        :close-on-select="false" :clear-on-select="false"
        :preserve-search="false" placeholder="Search for companies"
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
import {mapActions, mapGetters} from 'vuex';
import Multiselect from 'vue-multiselect';
import {tutorPrice, tutorPriceKeyValue, tagKeyValue} from '@/utils.js';

export default {
  name: 'question-filter',
  data: function() {
    return {
      tutorPrice,
      checkedCompanies: [],
      checkedPrice: tutorPrice[0],
      isRemote: false,
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
      const keys= this.checkedCompanies.map((v) => v.name);
      const mergedQuery = {...this.$route.query, checkedCompany: keys};
      this.$router.push({query: mergedQuery});
      this.$emit('updatedCompany', this.checkedCompanies);
      this.changedCompanies = false;
    },
    updatedPrice: function() {
      const mergedQuery = {
        ...this.$route.query,
        checkedPrice: this.checkedPrice.key,
      };
      this.$router.push({query: mergedQuery});
      this.$emit('updatedPrice', this.checkedPrice);
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
    this.getCompanies();
    let tagKeys = this.$route.query?.checkedCompany || [];
    if (typeof tagKeys === 'string') {
      tagKeys = [tagKeys];
    }
    for (const key of tagKeys) {
      if (key in tagKeyValue) {
        this.checkedCompanies.push(tagKeyValue[key]);
      }
    }
    const tutorPriceKey = this.$route.query?.checkedPrice;
    if (tutorPriceKey && tutorPriceKey in tutorPriceKeyValue) {
      this.checkedPrice = tutorPriceKeyValue[tutorPriceKey];
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
