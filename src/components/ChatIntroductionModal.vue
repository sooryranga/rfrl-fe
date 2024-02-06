<template>
  <transition name="modal">
    <div class="modal-mask">
      <transition name="fade">
        <div v-if="showError" class="alert alert-danger fade-in" role="alert">
          {{error}}
        </div>
      </transition>
      <div class="modal-dialog modal-dialog-centered" role="education">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">
              Session Booking
            </h5>
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
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import {
  messagesRef,
} from '@/firestore';


export default {
  props: {
    clientId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters('profile', ['currentProfileId']),
  },
  data() {
    return {
      introduction: '',
      showError: false,
      error: null,
    };
  },
  methods: {
    ...mapActions('chatRooms', ['createRoom']),
    cancel() {
      this.$emit('cancel');
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
      if (this.introduction === '') {
        this.setError('You need to introduce your self to the mentee!');
        return;
      }
      this.$emit('introduced');

      const roomId = await this.createRoom([this.clientId]);

      const message = {
        senderId: this.currentProfileId,
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
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

</style>
