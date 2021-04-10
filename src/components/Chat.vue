<template>
  <div class="window-container h-100">
    <div class="row h-100">
      <div class="col h-100">
        <!--@typingMessage="typingMessage"-->
        <chat-window
          height="100%"
          :theme="theme"
          :styles="styles"
          :currentUserId="currentUserId"
          :rooms="loadingRooms ? [] : rooms"
          :loadingRooms="loadingRooms"
          :messages="messages"
          :messagesLoaded="messagesLoaded"
          :roomMessage="roomMessage"
          :showAudio="showAudio"
          :showAddRoom="showAddRoom"
          :showReactionEmojis="showReactionEmojis"
          :showEmojis="showEmojis"
          :menuActions="menuActions"
          :messageActions="messageActions"
          :roomId="roomId"
          @fetchMessages="fetchMessages"
          @sendMessage="sendMessage"
          @openFile="openFile"
          @menuActionHandler="menuActionHandler"
          @messageActionHandler="messageActionHandler"
          @sendMessageReaction="sendMessageReaction"
        >
        </chat-window>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {firebase} from '@firebase/app';
import {
  roomsRef,
  messagesRef,
  usersRef,
  filesRef,
} from '@/firestore';
import {parseTimestamp, isSameDay} from '@/utils';

import ChatWindow from 'vue-advanced-chat';
import 'vue-advanced-chat/dist/vue-advanced-chat.css';

export default {
  components: {
    ChatWindow,
  },

  props: ['currentUserId', 'theme', 'roomId'],

  data() {
    return {
      menuActions: [
        {
          name: 'deleteRoom',
          title: 'Delete Chat',
        },
      ],
      showReactionEmojis: false,
      showEmojis: false,
      showAddRoom: false,
      showAudio: false,
      perPage: 20,
      rooms: [],
      allUsers: [],
      loadingRooms: true,
      selectedRoom: null,
      messages: [],
      messagesLoaded: false,
      roomMessage: '',
      start: null,
      end: null,
      roomsListeners: [],
      listeners: [],
      typingMessageCache: '',
      disableForm: false,
      inviteRoomId: null,
      removeRoomId: null,
      removeUserId: '',
      messageVersion: 0,
      removeUsers: [],
      unsubscribeMutations: null,
      styles: {container: {borderRadius: '2px'}},
      messageActions: [
        {
          name: 'replyMessage',
          title: 'Reply',
        },
      ],
      // ,dbRequestCount: 0
    };
  },

  mounted() {
    this.fetchRooms();
    this.updateUserOnlineStatus();

    this.unsubscribeMutations = this.$store.subscribe((mutation, state)=>{
      if (mutation.type != 'roomMessages/set_messages') return;
      if (!this.selectedRoom) return;
      const messages = this.messagesByRoomId.messages[this.selectedRoom];
      const version = this.messagesByRoomId.meta[this.selectedRoom].version;
      if (this.messageVersion >= version) {
        return;
      }
      this.messages = [...messages];
      this.messageVersion = version;
    });
  },

  computed: {
    ...mapGetters(
        'roomMessages',
        ['latestMessage', 'messagesByRoomId'],
    ),
  },

  destroyed() {
    this.unsubscribeMutations();
    this.resetRooms();
  },

  watch: {
    latestMessage: {
      handler: function(latestMessage) {
        this.updateRoomsWithLatestMessage(latestMessage);
      },
      deep: true,
    },
  },

  methods: {
    ...mapGetters('chatRooms', ['users']),
    ...mapActions('chatRooms', ['fetchAndSetRooms']),
    ...mapActions('roomMessages', ['fetchAndSetMessages']),

    updateRoomsWithLatestMessage(latestMessages) {
      this.loadingRooms = true;
      const rooms = {};
      this.rooms.forEach((room) => {
        rooms[room._id] = {...room};
      });
      const roomIds = Object.keys(latestMessages);

      for (let i=0; i < roomIds.length; i++) {
        const roomId = roomIds[i];
        if (!rooms[roomId]) {
          console.error(
              'Room id from latest messages is not found within local state',
              roomId,
          );
          continue;
        }
        rooms[roomId].lastMessage = this.formatLastMessage(
            latestMessages[roomId],
        );
      }
      this.rooms = Object.values(rooms);
      this.loadingRooms = false;
    },

    resetRooms() {
      this.loadingRooms = true;
      this.rooms = [];
      this.resetMessages();
    },

    resetMessages() {
      this.messages = [];
      this.messagesLoaded = false;
      this.messageVersion = 0;
      if (this.selectedRoom) this.$emit('newRoom', this.selectedRoom);
    },

    async fetchRooms() {
      this.resetRooms();
      const roomIdtoRoom = await this.fetchAndSetRooms();
      const userIdtoUser = {...this.users()};

      this.allUsers = Object.values(userIdtoUser);

      const roomList = {};
      for (const roomId of Object.keys(roomIdtoRoom)) {
        const room = roomIdtoRoom[roomId];
        roomList[roomId] = {...room, users: []};
        room.users.forEach((userId) => {
          const foundUser = userIdtoUser[userId];
          if (foundUser) roomList[roomId].users.push(foundUser);
        });
      }

      const formattedRooms = [];

      Object.keys(roomList).forEach((key) => {
        const room = roomList[key];

        console.log(room._id, room.users, this.currentUserId);
        const roomContacts = room.users.filter(
            (user) => user._id !== this.currentUserId,
        );

        room.roomName =
          roomContacts.map((user) => user.username).join(', ') || 'Myself';

        const roomAvatar =
          roomContacts.length === 1 && roomContacts[0].avatar ?
            roomContacts[0].avatar :
            require('@/assets/logo.png');

        formattedRooms.push({
          ...{
            roomId: key,
            avatar: roomAvatar,
            ...room,
          },
        });
      });

      this.rooms = formattedRooms;
      this.loadingRooms = false;

      this.updateRoomsWithLatestMessage(this.latestMessage);
      // this.listenUsersOnlineStatus();
      // this.listenRoomsTypingUsers(query);
      // setTimeout(() => console.log('TOTAL', this.dbRequestCount), 2000)
    },

    formatLastMessage(message) {
      if (!message.timestamp) return;
      const date = new Date(message.timestamp.seconds * 1000);
      const timestampFormat = (
        isSameDay(date, new Date()) ? 'HH:mm' : 'DD/MM/YY'
      );

      let timestamp = parseTimestamp(message.timestamp, timestampFormat);
      if (timestampFormat === 'HH:mm') timestamp = `Today, ${timestamp}`;

      let content = message.content;
      if (message.file) content = `${message.file.name}.${message.file.type}`;

      return {
        ...message,
        ...{
          content,
          timestamp,
          date: message.timestamp.seconds,
          seen: message.sender_id === this.currentUserId ? message.seen : null,
          new:
            message.sender_id !== this.currentUserId &&
            (!message.seen || !message.seen[this.currentUserId]),
        },
      };
    },

    async fetchMessages({room, options = {}}) {
      this.selectedRoom = room.roomId;
      if (options.reset) this.resetMessages();
      const {messages, loaded} = await this.fetchAndSetMessages(room);
      if (loaded) {
        this.messagesLoaded = loaded;
      }
      this.messages = messages;
    },

    // currently not supported
    markMessagesSeen(room, message) {
      if (
        message.data().sender_id !== this.currentUserId &&
        (!message.data().seen || !message.data().seen[this.currentUserId])
      ) {
        messagesRef(room.roomId)
            .doc(message._id)
            .update({
              [`seen.${this.currentUserId}`]: new Date(),
            });
      }
    },

    async sendMessage({content, roomId, file, replyMessage}) {
      const message = {
        sender_id: this.currentUserId,
        content,
        timestamp: new Date(),
      };

      if (file) {
        message.file = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: file.localUrl,
        };
      }

      if (replyMessage) {
        message.replyMessage = {
          _id: replyMessage._id,
          content: replyMessage.content,
          sender_id: replyMessage.sender_id,
        };

        if (replyMessage.file) {
          message.replyMessage.file = replyMessage.file;
        }
      }

      const {id} = await messagesRef(roomId).add(message);
      if (file) this.uploadFile({file, messageId: id, roomId});
    },

    openFile({message, action}) {
      window.open(message.file.url, '_blank');
    },

    async uploadFile({file, messageId, roomId}) {
      const uploadFileRef = filesRef
          .child(this.currentUserId)
          .child(messageId)
          .child(`${file.name}.${file.type}`);

      await uploadFileRef.put(file.blob, {contentType: file.type});
      const url = await uploadFileRef.getDownloadURL();

      await messagesRef(roomId)
          .doc(messageId)
          .update({
            ['file.url']: url,
          });
    },

    menuActionHandler({action, roomId}) {
      switch (action.name) {
        case 'inviteUser':
          return this.inviteUser(roomId);
        case 'removeUser':
          return this.removeUser(roomId);
        case 'deleteRoom':
          return this.deleteRoom(roomId);
      }
    },

    messageActionHandler() {
      // do something
    },

    textareaActionHandler({message, roomId}) {
      this.roomMessage = 'Implement your own action!';
    },

    async sendMessageReaction({reaction, remove, messageId, roomId}) {
      const dbAction = remove ?
        firebase.firestore.FieldValue.arrayRemove(this.currentUserId) :
        firebase.firestore.FieldValue.arrayUnion(this.currentUserId);

      await messagesRef(roomId)
          .doc(messageId)
          .update({
            [`reactions.${reaction.name}`]: dbAction,
          });
    },

    typingMessage({message, roomId}) {
      if (message?.length > 1) {
        return (this.typingMessageCache = message);
      }

      if (message?.length === 1 && this.typingMessageCache) {
        return (this.typingMessageCache = message);
      }

      this.typingMessageCache = message;

      const dbAction = message ?
        firebase.firestore.FieldValue.arrayUnion(this.currentUserId) :
        firebase.firestore.FieldValue.arrayRemove(this.currentUserId);

      roomsRef.doc(roomId).update({
        typingUsers: dbAction,
      });
    },

    // currently not supported
    async listenRoomsTypingUsers(query) {
      const listener = query.onSnapshot((rooms) => {
        // this.incrementDbCounter('Listen Rooms Typing Users', rooms.size)
        rooms.forEach((room) => {
          const foundRoom = this.rooms.find((r) => r.roomId === room._id);
          if (foundRoom) foundRoom.typingUsers = room.data().typingUsers;
        });
      });
      this.roomsListeners.push(listener);
    },

    updateUserOnlineStatus() {
      const userStatusRef = firebase
          .database()
          .ref('/status/' + this.currentUserId);

      const isOfflineData = {
        state: 'offline',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      const isOnlineData = {
        state: 'online',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      firebase
          .database()
          .ref('.info/connected')
          .on('value', (snapshot) => {
            if (snapshot.val() === false) return;

            userStatusRef
                .onDisconnect()
                .set(isOfflineData)
                .then(() => {
                  userStatusRef.set(isOnlineData);
                });
          });
    },

    // Currently not supported
    listenUsersOnlineStatus() {
      this.rooms.map((room) => {
        room.users.map((user) => {
          const listener = firebase
              .database()
              .ref('/status/' + user._id)
              .on('value', (snapshot) => {
                if (!snapshot || !snapshot.val()) return;

                const timestampFormat = isSameDay(
                    new Date(snapshot.val().last_changed),
                    new Date(),
                ) ?
                'HH:mm' :
                'DD MMMM, HH:mm';

                const timestamp = parseTimestamp(
                    new Date(snapshot.val().last_changed),
                    timestampFormat,
                );

                const lastChanged = (
                timestampFormat === 'HH:mm' ? `today, ${timestamp}` : timestamp
                );

                user.status = {...snapshot.val(), lastChanged};

                const roomIndex = this.rooms.findIndex(
                    (r) => room.roomId === r.roomId,
                );

                this.$set(this.rooms, roomIndex, room);
              });
          this.roomsListeners.push(listener);
        });
      });
    },

    async createRoom() {
      this.disableForm = true;

      const {id} = await usersRef.add({username: this.addRoomUsername});
      await usersRef.doc(id).update({_id: id});
      await roomsRef.add({users: [id, this.currentUserId]});

      this.addRoomUsername = '';
      this.fetchRooms();
    },

    async addRoomUser() {
      this.disableForm = true;

      const {id} = await usersRef.add({username: this.invitedUsername});
      await usersRef.doc(id).update({_id: id});

      await roomsRef
          .doc(this.inviteRoomId)
          .update({users: firebase.firestore.FieldValue.arrayUnion(id)});

      this.inviteRoomId = null;
      this.invitedUsername = '';
      this.fetchRooms();
    },

    removeUser(roomId) {
      this.resetForms();
      this.removeRoomId = roomId;
      this.removeUsers = (
        this.rooms.find((room) => room.roomId === roomId).users
      );
    },

    async deleteRoomUser() {
      this.disableForm = true;

      await roomsRef.doc(this.removeRoomId).update({
        users: firebase.firestore.FieldValue.arrayRemove(this.removeUserId),
      });

      this.removeRoomId = null;
      this.removeUserId = '';
      this.fetchRooms();
    },

    async deleteRoom(roomId) {
      const room = this.rooms.find((r) => r.roomId === roomId);
      if (
        room.users.find((user) => user._id === 'SGmFnBZB4xxMv9V4CVlW') ||
        room.users.find((user) => user._id === '6jMsIXUrBHBj7o2cRlau')
      ) {
        return alert('Nope, for demo purposes you cannot delete this room');
      }

      const ref = messagesRef(roomId);

      ref.get().then((res) => {
        if (res.empty) return;
        res.docs.map((doc) => ref.doc(doc.id).delete());
      });

      await roomsRef.doc(roomId).delete();

      this.fetchRooms();
    },

    resetForms() {
      this.disableForm = false;
      this.addRoomUsername = '';
      this.removeRoomId = null;
      this.removeUserId = '';
    },

    // ,incrementDbCounter(type, size) {
    //   size = size || 1
    //   this.dbRequestCount += size
    //   console.log(type, size)
    // }
  },
};
</script>

<style lang="scss" scoped>
.window-container {
  width: 100%;
}

.chat-forms {
  padding-bottom: 20px;

  form {
    padding-top: 20px;
  }

  input {
    padding: 5px;
    width: 180px;
    height: 21px;
    border-radius: 4px;
    border: 1px solid #d2d6da;
    outline: none;
    font-size: 14px;
    vertical-align: middle;

    &::placeholder {
      color: #9ca6af;
    }
  }

  button {
    background: #1976d2;
    color: #fff;
    outline: none;
    cursor: pointer;
    border-radius: 4px;
    padding: 8px 12px;
    margin-left: 10px;
    border: none;
    font-size: 14px;
    transition: 0.3s;
    vertical-align: middle;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }

    &:disabled {
      cursor: initial;
      background: #c6c9cc;
      opacity: 0.6;
    }
  }

  .button-cancel {
    color: #a8aeb3;
    background: none;
    margin-left: 5px;
  }

  select {
    vertical-align: middle;
    height: 33px;
    width: 120px;
    font-size: 13px;
  }
}
</style>
