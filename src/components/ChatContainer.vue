<template>
  <div class="container-xl pt-3 h-100">
    <div class="row h-100">
      <div class="col-8 h-100">
        <chat
        :currentUserId="currentProfileId"
        :theme="theme"
        :room-id="selectedRoom"
        v-if="showChat"
        @newRoom="setNewRoom"
        />
      </div>
      <div class="col h-100">
        <div class="row">
          <div class="col">
            <tutoring-scheduler
              :room-id="roomId"
            />
          </div>
        </div>
        <div class="row pt-2">
          <div class="col">
            <scheduled-tutoring
            :room-id="roomId"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chat from '@/components/Chat.vue';
import TutoringScheduler from '@/components/TutoringScheduler.vue';
import {mapGetters} from 'vuex';

export default {
  name: 'chat-container',

  components: {
    Chat,
    TutoringScheduler,
  },

  computed: {
    ...mapGetters('profile', ['currentProfileId']),
  },

  mounted() {
    if (this.$route.params?.roomId) {
      this.selectedRoom = this.$route.params?.roomId;
      this.roomId = this.selectedRoom;
    }
  },

  data() {
    return {
      theme: 'light',
      showChat: true,
      selectedRoom: null,
      roomId: null,
    };
  },

  watch: {
    currentProfileId() {
      this.showChat = false;
      setTimeout(() => (this.showChat = true), 150);
    },
  },

  methods: {
    setNewRoom(roomId) {
      this.roomId = roomId;
    },
  },

};
</script>

<style lang="scss">
select {
  height: 20px;
  outline: none;
  border: 1px solid #e0e2e4;
  background: #fff;
}

.user-logged {
  font-size: 12px;
  margin-right: 5px;
}
</style>
