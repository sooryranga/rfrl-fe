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
    <div class="row mt-3">
      <div class="col mx-3">
        <label>Industry</label>
      </div>
    </div>
    <div class="row">
      <div class="col mx-3">
        <multiselect
        placeholder="Software Engineering"
        :disabled="true" :options="industry"
        label="name" track-by="name" :preselect-first="false">
        </multiselect>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col mx-3">
        <label>Tutoring</label>
      </div>
      <div class="col my-auto mx-auto">
        <input
          v-model="forTutoring"
          v-on:click="updateForTutoring"
          type="checkbox"
          :disabled="true"
          id="flexSwitchCheckDefault">
      </div>
    </div>
    <div class="row mt-3">
      <div class="col mx-3">
        <label>Referral</label>
      </div>
      <div class="col my-auto mx-auto">
        <input
          v-model="forReferral"
          v-on:click="updateForReferral"
          type="checkbox"
          :disabled="true"
          id="flexSwitchCheckDefault">
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import Multiselect from 'vue-multiselect';
import {Profile} from '@/api';

export default {
  name: 'question-filter',
  data: function() {
    return {
      checkedCompanies: [],
      industry: [
        {name: 'Software Engineering', id: 1},
      ],
      type: [
        {name: 'Tutoring & Referral', id: 1},
      ],
      forTutoring: true,
      forReferral: true,
      changedCompanies: false,
    };
  },
  computed: {
    ...mapGetters('companies', ['companies']),
    ...mapGetters('profile', ['currentProfile']),
    companyIds() {
      return this.checkedCompanies.map((c) => c.id);
    },
  },
  components: {
    Multiselect,
  },
  methods: {
    ...mapActions('companies', ['getCompanies']),
    ...mapActions('listTutors', ['updateParams']),
    changeCompany() {
      this.changedCompanies = true;
    },
    async updateForTutoring() {
      console.log('updateForTutoring');
    },
    async updateForReferral() {
      console.log('updateForReferral');
    },
    async updatedCompany() {
      if (!this.changedCompanies) {
        return;
      }

      await this.updateParams({fromCompanyIds: this.companyIds});
      // filter with checkedCompanies
      this.changedCompanies = false;
    },
  },
  async mounted() {
    await this.getCompanies();
    const isLookingForReferral = this.currentProfile.isLookingForReferral;
    if (isLookingForReferral) {
      const {companyIds} = await Profile.ProfileService.
          getWantingCompanyReferral({
            profileId: this.currentProfile.id,
          });
      const companyIdSet = new Set(companyIds);
      this.checkedCompanies = this.companies.filter(
          (c) => companyIdSet.has(c.id),
      );
    }

    this.updateParams({fromCompanyIds: this.companyIds});
  },
};
</script>


<style src = "vue-multiselect/dist/vue-multiselect.min.css">
.selected{
  background-color: #343a40;
  border-color: #343a40;
}
</style>
