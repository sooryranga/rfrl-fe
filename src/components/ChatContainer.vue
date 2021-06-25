<template>
  <div class="h-100">
    <div id="chat-container">
      <div id="left-container">
        <tutoring-scheduler
          :room-id="roomId"
        />
        <scheduled-tutoring
        :room-id="roomId"
        />
      </div>
      <div id="right-container">
        <chat
        class="chat"
        :currentUserId="currentProfileId"
        :theme="theme"
        :room-id="selectedRoom"
        v-if="showChat"
        @newRoom="setNewRoom"
        />
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

<style lang="scss" scoped>
#chat-container{
  flex-direction: row;
  display:flex;
  height:100%;
  flex-wrap: nowrap;
}

#left-container{
  background: var(--clr-primary);
  width: 380px;
  padding-left:1rem;
  padding-right:1rem;
  padding-top:3.5rem;
}

#right-container{
  flex:1 1
}

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
