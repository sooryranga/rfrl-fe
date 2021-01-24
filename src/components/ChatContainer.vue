<template>
  <div class="container-xl pt-3 h-100">
    <!-- <div class="row" style="height:4%">
      <div class="col">
        <button @click="resetData">Clear Data</button>
        <button @click="addData" :disabled="updatingData">Add Data</button>
      </div>
    </div> -->
    <div class="row h-100">
      <div class="col-8 h-100">
        <chat
        :currentUserId="currentProfile.id"
        :theme="theme"
        :roomId="selectedRoom"
        v-if="showChat"
        @newRoom="setNewRoom"
        />
      </div>
      <div class="col h-100">
        <div class="row">
          <div class="col">
            <tutoring-scheduler
            :roomId="roomId"
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <scheduled-tutoring
            v-bind:profile-id="currentProfile.id"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {roomsRef, usersRef} from '@/firestore';
import Chat from '@/components/Chat.vue';
import TutoringScheduler from '@/components/TutoringScheduler.vue';
import {mapGetters} from 'vuex';

export default {
  components: {
    Chat,
    TutoringScheduler,
  },

  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },

  mounted() {
    if (this.$route.params?.roomId) {
      this.selectedRoom = this.$route.params?.roomId;
    }
  },

  data() {
    return {
      theme: 'light',
      showChat: true,
      selectedRoom: null,
      users: [
        {
          _id: '6R0MijpK6M4AIrwaaCY2',
          username: 'Luke',
          avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
        },
        {
          _id: 'SGmFnBZB4xxMv9V4CVlW',
          username: 'Leia',
          avatar: 'https://avatarfiles.alphacoders.com/184/thumb-184913.jpg',
        },
        {
          _id: '6jMsIXUrBHBj7o2cRlau',
          username: 'Yoda',
          avatar:
            'https://vignette.wikia.nocookie.net/teamavatarone/images/4/45/Yoda.jpg/revision/latest?cb=20130224160049', // eslint-disable-line
        },
      ],
      updatingData: false,
    };
  },

  watch: {
    currentUserId() {
      this.showChat = false;
      setTimeout(() => (this.showChat = true), 150);
    },
  },

  methods: {
    setNewRoom(roomId) {
      this.roomId = roomId;
    },
    resetData() {
      roomsRef.get().then((val) => {
        val.forEach(async (val) => {
          const ref = roomsRef.doc(val.id).collection('messages');

          await ref.get().then((res) => {
            if (res.empty) return;
            res.docs.map((doc) => ref.doc(doc.id).delete());
          });

          roomsRef.doc(val.id).delete();
        });
      });

      usersRef.get().then((val) => {
        val.forEach((val) => {
          usersRef.doc(val.id).delete();
        });
      });
    },
    async addData() {
      this.updatingData = true;

      const user1 = this.users[0];
      await usersRef.doc(user1._id).set(user1);

      const user2 = this.users[1];
      await usersRef.doc(user2._id).set(user2);

      const user3 = this.users[2];
      await usersRef.doc(user3._id).set(user3);

      const roomId = '6jMsIXUrBHBj7o2cRlau';
      await roomsRef.doc(roomId).set(
          {users: [this.currentProfile.id, user3._id], timestamp: new Date()},
      );

      this.updatingData = false;
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
