<template>
  <div>
    <div class="flex-container-column">
      <div id="left-container">
        <h4 id="title" for="flexSwitchCheckDefault" >Want Referrals?</h4>
      </div>
      <div>
        <label class="switch">
          <input
            v-model="isLookingForReferral"
            v-on:click="onClickReferralButton"
            type="checkbox"
            id="flexSwitchCheckDefault"/>
            <div></div>
        </label>
      </div>
    </div>
    <div v-if="isLookingForReferral" id="company-selector-container">
      <multiselect
      v-model="checkedCompanies" :options="companyList" :multiple="true"
      :close-on-select="false" :clear-on-select="false"
      :preserve-search="false" placeholder="Search for tags"
      :select-label="''" :taggable="false" :deselect-label="''"
      @remove="removeCompany" @select="addCompany" @close="multiselectClose"
      @open="multiselectOpen"
      label="name" track-by="name" :preselect-first="false" open-direction="bottom"/>
    </div>
  </div>
</template>

<script>
import {Profile} from '@/api';
import {mapActions, mapGetters} from 'vuex';
import Multiselect from 'vue-multiselect';

export default {
  computed: {
    ...mapGetters('companies', ['companies', 'companyList']),
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
  },
};
</script>

<style scoped>
.flex-container-column{
  flex-direction: row;
  display:flex;
  flex-wrap: nowrap;
}

#left-container{
  flex: 1 1;
}
</style>

<style src = "vue-multiselect/dist/vue-multiselect.min.css">
.selected{
  background-color: #343a40;
  border-color: #343a40;
}
</style>

<style scoped src="@/css/switch-input.css">
</style>
