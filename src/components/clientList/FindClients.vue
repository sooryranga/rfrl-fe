<template>
  <div class="h-100 mt-3 mx-auto">
    <transition name="fade">
      <div v-if="clientError" class="alert alert-danger fade-in" role="alert">
        {{clientError}}
      </div>
      <div v-if="companyError" class="alert alert-danger fade-in" role="alert">
        {{companyError}}
      </div>
    </transition>
    <div v-if="currentProfile.verifiedWorkEmail">
      <div class="row">
        <div class="col">
          <p>You are shown clients who wants referral for {{companyName}}</p>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <client-selector/>
        </div>
      </div>
    </div>
    <div v-else class="h-100 w-100">
      <div class="jumbotron">
        <h1 class="display-4">Hey there!</h1>
        <p class="lead">You haven't verified your work email yet. Please do so to get related clients for you!</p>
        <hr class="my-4">
        <p class="lead">
          <a class="btn btn-primary btn-lg" v-on:click="verifyWorkEmail">Verify your work email!</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {Profile} from '@/api';
import {mapActions, mapGetters} from 'vuex';
import ClientSelector from './ClientSelector.vue';

export default {
  name: 'Clients',
  components: {
    ClientSelector,
  },
  data() {
    return {
      companyName: '',
    };
  },
  computed: {
    ...mapGetters('clients', ['clientError']),
    ...mapGetters('profile', ['currentProfile']),
    ...mapGetters('companies', ['companyError', 'companies']),
  },
  methods: {
    ...mapActions('clients', ['getClients']),
    ...mapActions('companies', ['getCompanies']),
    verifyWorkEmail() {
      this.$router.push({
        name: 'verify-email',
        params: {
          emailType: Profile.WORK_EMAIL,
        },
      });
    },
  },
  async mounted() {
    await this.getCompanies();

    const companyId = this.currentProfile.companyId;

    const id = this.currentProfile.companyId;
    const company = this.companies.filter((c) => c.id===id);

    if (company.length > 0) {
      this.companyName = company[0].name;
    }

    this.getClients({wantingReferralCompanyId: companyId ? [companyId]: []});
  },
};
</script>


<style scoped>
.tutorPhoto{
  height:12vh;
  padding:5px;
  width:100%;
}
</style>
