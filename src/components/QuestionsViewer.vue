<template>
  <div v-if="selectedQuestion" class="">
    <transition name="modal">
      <div v-if="showModal" class="modal-mask ">
        <transition name="fade">
          <div v-if="showError" class="alert alert-danger fade-in" role="alert">
            {{error}}
          </div>
        </transition>
        <div class="modal-dialog modal-dialog-centered" role="education">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Session Booking</h5>
              <button v-on:click="cancel" type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col">
                  <h6> Introduce your self! </h6>
                </div>
              </div>
              <div class="row h-75">
                <div class="col h-100">
                  <textarea
                  class="h-100 w-100"
                  v-model="introduction"
                  placeholder="Introduce your self to the mentee and explain why you would be best to help them!"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" v-on:click="cancel" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" v-on:click="save" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <p id="title"> {{ selectedQuestion.title }} </p>
    <p class="my-1"> Posted By : {{ selectedQuestion.posterName }} </p>
    <p class="my-1"> Created At : {{ timeAgoFormat(selectedQuestion.createdAt) }} </p>
    <button
    class="btn btn-outline-dark shadow-none my-3"
    v-on:click="toCalendar">
    <small>Schedule Session</small>
    </button>
    <p class="text-large"> {{ selectedQuestion.body }}</p>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import TimeAgo from 'javascript-time-ago';
import {
  messagesRef,
} from '@/firestore';

const timeAgo = new TimeAgo('en-US');

export default {
  name: 'questions-viewer',
  computed: {
    ...mapGetters('questions', ['selectedQuestion']),
    ...mapGetters('profile', ['currentProfile']),
  },
  data() {
    return {
      introduction: null,
      showModal: false,
      showError: false,
      error: null,
    };
  },
  methods: {
    ...mapActions('chatRooms', ['createRoom']),

    timeAgoFormat(newDate) {
      return timeAgo.format(newDate);
    },
    toCalendar() {
      this.showModal = true;
    },
    cancel() {
      this.showModal = false;
    },
    setError(error) {
      this.error = error;
      this.showError = true;
      setTimeout(function() {
        this.error = null;
        this.showError = false;
      }.bind(this), 2000);
    },
    async save() {
      if (this.introduction == null) {
        this.setError('You need to introduce your self to the mentee!');
      }

      const roomId = await this.createRoom([this.selectedQuestion.userId]);

      const message = {
        sender_id: this.currentProfile.id,
        content: this.introduction,
        timestamp: new Date(),
      };

      await messagesRef(roomId).add(message);

      this.$router.push(
          {
            name: 'chat',
            params: {
              roomId: roomId,
            },
          },
      );
    },
  },
};
</script>

<style scoped>
.text-large {
  font-size: 100%;
}
#title {
  font-size: 180%;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
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
</style>
