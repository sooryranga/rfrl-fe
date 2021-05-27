<template>
  <div id="want-referrals" class="shadow p-3 my-3 bg-white">
    <div class="row">
      <div class="col">
        <h5 class="my-2" for="flexSwitchCheckDefault" >Want Referrals?</h5>
      </div>
      <div class="col-2 my-auto mx-auto">
        <input
          v-model="isLookingForReferral"
          v-on:click="onClickReferralButton"
          type="checkbox"
          id="flexSwitchCheckDefault">
      </div>
    </div>
    <div v-if="isLookingForReferral" class="row w-100">
      <div class="col w-100">
        <multiselect
        v-model="checkedCompanies" :options="companies" :multiple="true"
        :close-on-select="false" :clear-on-select="false"
        :preserve-search="false" placeholder="Search for tags"
        :select-label="''" :taggable="false" :deselect-label="''"
        @remove="removeCompany" @select="addCompany" @close="multiselectClose"
        @open="multiselectOpen"
        label="name" track-by="name" :preselect-first="false" open-direction="bottom"/>
      </div>
    </div>
  </div>
</template>

<script>
import {Profile} from '@/api';
import {mapActions, mapGetters} from 'vuex';
import Multiselect from 'vue-multiselect';

export default {
  computed: {
    ...mapGetters('companies', ['companies']),
    ...mapGetters('profile', ['currentProfile']),
    companyIds() {
      return this.checkedCompanies.map((c) => c.id);
    },
  },

  data() {
    return {
      checkedCompanies: [],
      isLookingForReferral: false,
      isMultiselectOpen: false,
    };
  },

  components: {
    Multiselect,
  },

  methods: {
    ...mapActions('companies', ['getCompanies']),
    ...mapActions('profile', ['updateIsLookingForReferral']),
    async onClickReferralButton() {
      await this.updateIsLookingForReferral({
        isLookingForReferral: this.isLookingForReferral,
        companyIds: this.companyIds,
      });
    },
    async removeCompany(removedOption) {
      if (this.isMultiselectOpen === false) {
        await this.updateIsLookingForReferral({
          isLookingForReferral: this.isLookingForReferral,
          companyIds: this.companyIds.filter((id) => id != removedOption.id),
        });
      }
      this.changedTags = true;
    },
    addCompany() {
      this.changedTags = true;
    },
    multiselectOpen() {
      this.isMultiselectOpen = true;
    },
    async multiselectClose() {
      this.isMultiselectOpen = false;
      if (!this.changedTags) {
        return;
      }

      await this.updateIsLookingForReferral({
        isLookingForReferral: this.isLookingForReferral,
        companyIds: this.companyIds,
      });
    },
  },
  async mounted() {
    await this.getCompanies();
    this.isLookingForReferral = this.currentProfile.isLookingForReferral;
    if (this.isLookingForReferral) {
      const {companyIds} = await Profile.ProfileService.
          getWantingCompanyReferral({
            profileId: this.currentProfile.id,
          });
      const companyIdSet = new Set(companyIds);
      this.checkedCompanies = this.companies.filter(
          (c) => companyIdSet.has(c.id),
      );
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
