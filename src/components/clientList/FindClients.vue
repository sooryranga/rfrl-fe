<template>
  <div id="container" class="w-100 h-100">
    <transition name="fade">
      <div v-if="clientError" class="alert alert-danger fade-in" role="alert">
        {{clientError}}
      </div>
      <div v-if="companyError" class="alert alert-danger fade-in" role="alert">
        {{companyError}}
      </div>
    </transition>
    <div v-if="currentProfile.verifiedWorkEmail" class="flex-container">
      <div class="flex-item-shrink">
        <h1 id="title"> Clients </h1>
      </div>
      <div class="flex-item-shrink">
        <h2 id="description">You are shown clients who wants referral for {{companyName}}</h2>
      </div>
      <div class="flex-item-grow">
        <client-selector/>
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
    ...mapGetters('listClients', ['clientError']),
    ...mapGetters('profile', ['currentProfile']),
    ...mapGetters('companies', ['companyError', 'companies']),
  },
  methods: {
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

    const id = this.currentProfile.companyId;
    if (id in this.companies) {
      this.companyName = this.companies[id].name;
    }
  },
};
</script>


<style scoped>
#container{
  padding-right:2rem;
  padding-top:2.5rem;
  padding-left:2rem;
}

#title{
  font-size: 3rem;
  font-weight: 400;
  color:var(--clr-primary);
}

#description{
  font-size: 1.2rem;
  font-weight: 300;
  color:var(--clr-gray-4);
}

.tutorPhoto{
  height:12vh;
  padding:5px;
  width:100%;
}
.flex-container{
  flex-direction: column;
  display:flex;
  max-height:100%;
  flex-wrap: nowrap;
}
.flex-item-grow{
  flex-grow: 1;

  overflow-y: auto;
  overflow-x: hidden;

  /* for Firefox */
  min-height: 0;
}
.flex-item-shrink{
  flex:0;
}
</style>
