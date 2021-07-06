<template>
  <div v-if="selectedQuestion" class="">
    <chat-introduction-modal
      v-if="showModal"
      @cancel="cancel"
      @introduced="save"
      :clientId="selectedQuestion.from.id"/>
    <p id="title">
      <button id="go-back-btn" type="button" class="btn btn-link shadow-none" v-on:click="goBack">
         <span class="material-icons-outlined">arrow_back</span>
      </button>
      {{ selectedQuestion.title }}
    </p>
    <p id="poster-client">
      <img
          v-if="selectedQuestion.from.photo"
          id="profile-picture"
          v-bind:src="selectedQuestion.from.photo"
        />
      {{ selectedQuestion.from.firstName }} {{ selectedQuestion.from.lastName[0] }} ·
      {{ timeAgoFormat(selectedQuestion.createdAt) }}
    </p>
    <button
    class="primary-btn primary-btn-dark shadow-none my-3"
    id="schedule-btn"
    v-if="canScheduleSession"
    v-on:click="scheduleSession">
    <small>Schedule Session</small>
    </button>
    <p class="text-large"> {{ selectedQuestion.body }}</p>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import TimeAgo from 'javascript-time-ago';
import ChatIntroductionModal from '@/components/ChatIntroductionModal.vue';

const timeAgo = new TimeAgo('en-US');

export default {
  name: 'questions-viewer',
  components: {
    ChatIntroductionModal,
  },
  computed: {
    ...mapGetters('questions', ['selectedQuestion']),
    ...mapGetters('profile', ['currentProfileId']),
    canScheduleSession() {
      return this.selectedQuestion.from.id != this.currentProfileId;
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    ...mapActions('questions', ['applyToQuestion']),

    goBack() {
      this.$emit('goback');
    },
    timeAgoFormat(newDate) {
      return timeAgo.format(newDate);
    },
    scheduleSession() {
      this.showModal = true;
    },
    cancel() {
      this.showModal = false;
    },
    async save() {
      await this.applyToQuestion(this.selectedQuestion.id);
    },
  },
};
</script>

<style scoped>
.text-large {
  font-size: 100%;
}
#title {
  font-size: 2.1rem;
  padding-top: 3.5rem;
  font-weight: 350;
  color: var(--clr-primary)
}
#poster-client{
  margin-top: 0.5rem;
  margin-bottom: 0;
  font-weight: 300;
  color: var(--clr-primary);
}
#post-time{
  margin-bottom: 0.1rem;
  font-size: 0.9rem;
  color: var(--clr-gray-5)
}

#profile-picture{
  width: 3rem;
  background-size: cover;
  background-position: top center;
  border-radius: 50%;
  margin-right: 1.5rem;
}

#schedule-btn{
  padding-top:0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 2rem;
  padding-right:2rem;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-content {
  height:400px;
  width:600px;
}
textarea {
    resize: none;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

#go-back-btn {
  display: none;
}

@media only screen and (max-width: 900px) {
  #go-back-btn {
    display: inline-block;
  }
}
</style>
