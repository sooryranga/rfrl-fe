<template>
  <div id="side-bar" class="h-100">
    <h1 id="title"> Referrers </h1>

    <div class="filter">
      <label>Referral Companies</label>
      <multiselect
      v-model="checkedCompanies" :options="companyList" :multiple="true"
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

    <div class="filter">
      <label>Industry</label>
      <multiselect
      placeholder="Software Engineering"
      :disabled="true" :options="industry"
      label="name" track-by="name" :preselect-first="false"/>
    </div>

    <div class="filter">
      <div class="row">
        <div class="col">
          <label>Tutoring</label>
        </div>
        <div class="col my-auto mx-auto">
          <label class="switch">
            <input
              v-model="forTutoring"
              v-on:click="updateForTutoring"
              :disabled="true"
              type="checkbox"
              id="flexSwitchCheckDefault"/>
              <div></div>
          </label>
        </div>
      </div>
    </div>

    <div class="filter">
      <div class="row">
        <div class="col">
          <label>Referral</label>
        </div>
        <div class="col my-auto mx-auto">
          <label class="switch">
            <input
              v-model="forReferral"
              v-on:click="updateForReferral"
              :disabled="true"
              type="checkbox"
              id="flexSwitchCheckDefault"/>
              <div></div>
          </label>
        </div>
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
    ...mapGetters('companies', ['companies', 'companyList']),
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
      this.checkedCompanies = companyIds.reduce(
          (arr, id) => {
            if (id in this.companies) {
              arr.push(this.companies[id]);
            }
            return arr;
          },
          [],
      );
    }

    this.updateParams({fromCompanyIds: this.companyIds});
  },
};
</script>

<style scoped src="@/css/switch-input.css">
</style>

<style scoped>
#title{
  padding-top: 3.5rem;
  font-size: 3rem;
  font-weight: 400;
}
#side-bar{
  width:340px;
  padding-left: 1rem;
  padding-right: 2rem;
  background-color: var(--clr-primary);
  color: white;
  font-size:1.1rem;
}
.filter{
  margin-top: 1rem;
}
</style>

<style src = "vue-multiselect/dist/vue-multiselect.min.css">
.selected{
  background-color: #343a40;
  border-color: #343a40;
}
</style>
