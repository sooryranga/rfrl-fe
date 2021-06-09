<template>
  <div id="want-referrals" class="shadow p-3 my-3 bg-white">
    <div class="mx-4">
      <div class="row">
        <div class="col">
          <h4 class="my-2 primary-color" for="flexSwitchCheckDefault" >Want Referrals?</h4>
        </div>
        <div class="col-2 my-auto">
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
      <div v-if="isLookingForReferral" class="row w-100">
        <div class="col w-100">
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

<style src = "vue-multiselect/dist/vue-multiselect.min.css">
.selected{
  background-color: #343a40;
  border-color: #343a40;
}
</style>

<style scoped>

/** Switch
 -------------------------------------*/

.switch input {
  position: absolute;
  opacity: 0;
}

/**
 * 1. Adjust this to size
 */

.switch {
  display: inline-block;
  height: 1.13rem;
  width: 2.2rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid var(--clr-gray-4);
}

.switch div {
  height: 1rem;
  width: 1rem;
  border-radius: 1rem;
  background: #FFF;
  box-shadow: 0 0.1rem 0.3rem rgba(0,0,0,0.3);
  -webkit-transition: all 300ms;
     -moz-transition: all 300ms;
          transition: all 300ms;
}

.switch input:checked + div {
  -webkit-transform: translate3d(100%, 0, 0);
     -moz-transform: translate3d(100%, 0, 0);
          transform: translate3d(100%, 0, 0);
          background-color: var(--clr-primary);
}

</style>
