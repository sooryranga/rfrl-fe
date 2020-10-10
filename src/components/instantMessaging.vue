<template>
  <div class="d-flex flex-grow-1">
    <chat-window
      class="d-flex flex-grow-1"
      :height="'auto'"
      :currentUserId="currentUserId"
      :rooms="rooms"
      :messages="messages"
      :single-room="true"
      :messages-loaded="messagesLoaded"
      :menu-actions="menuActions"
      :room-id="1"
      @fetchMessages="fetchMessages"
      @sendMessage="sendMessage"
      @editMessage="editMessage"
      @deleteMessage="deleteMessage"
      @openFile="openFile"
      @messageActionHandler="messageActionHandler"
      @sendMessageReaction="sendMessageReaction"
      @typingMessage="typingMessage" />
  </div>
</template>

<script>
import ChatWindow from 'vue-advanced-chat';
import utils from '@/utils';
import {v4 as uuidv4} from 'uuid';
import 'vue-advanced-chat/dist/vue-advanced-chat.css';

export default {
  name: 'instant-messaging',
  components: {
    ChatWindow,
  },
  data: function() {
    return {
      rooms: [{
        roomId: 1,
        roomName: 'Room 1',
        lastMessage: {
          content: 'Last message received',
          sender_id: 1234,
          username: 'John Doe',
          timestamp: '10:20',
          date: 123242424,
          seen: false,
          new: true,
        },
        users: [
          {
            _id: 1234,
            username: 'John Doe',
            status: {
              state: 'online',
              last_changed: 'today, 14:30',
            },
          },
          {
            _id: 4321,
            username: 'Doe John',
            status: {
              state: 'online',
              last_changed: 'today, 14:44',
            },
          },
        ],
      }],
      messages: [],
      currentUserId: 1234,
      messagesLoaded: true,
      menuActions: [],

      localConnection: null,
      remoteConnection: null,
      sendChannel: null,
      receiveChannel: null,
    };
  },
  mounted: function() {
    this.connectPeers();
  },
  beforeDestroy: function() {
    this.disconnectPeers();
  },
  methods: {
    fetchMessages({room, options = {}}) {
    },
    sendMessage: async function({content, roomId, file, replyMessage}) {
      const date = new Date;
      const messasge = {
        _id: uuidv4(),
        content: content,
        sender_id: 4321,
        username: 'John Doe',
        date: date.toDateString(),
        timestamp: utils.formatAMPM(date),
        seen: true,
        disable_actions: false,
        disable_reactions: false,
      };
      this.sendMessageRTC(messasge);
    },
    editMessage: async function({messageId, newContent, roomId, file}) {
    },
    deleteMessage: async function({messageId, roomId}) {
    },
    openFile: function({message, action}) {
      window.open(message.file.url, '_blank');
    },
    messageActionHandler: function() {
      // do something
    },
    sendMessageReaction: async function({reaction, remove, messageId, roomId}) {
    },
    typingMessage: function({message, roomId}) {
    },
    connectPeers: function() {
    // Create the local connection and its event listeners

      this.localConnection = new RTCPeerConnection();

      // Create the data channel and establish its event listeners
      this.sendChannel = this.localConnection.createDataChannel('sendChannel');
      this.sendChannel.onopen = this.handleSendChannelStatusChange;
      this.sendChannel.onclose = this.handleSendChannelStatusChange;

      // Create the remote connection and its event listeners

      this.remoteConnection = new RTCPeerConnection();
      this.remoteConnection.ondatachannel = this.receiveChannelCallback;

      // Set up the ICE candidates for the two peers

      this.localConnection.onicecandidate = (e) => !e.candidate ||
        this.remoteConnection.addIceCandidate(e.candidate)
            .catch(this.handleAddCandidateError);

      this.remoteConnection.onicecandidate = (e) => !e.candidate ||
        this.localConnection.addIceCandidate(e.candidate)
            .catch(this.handleAddCandidateError);

      // Now create an offer to connect; this starts the process

      this.localConnection.createOffer()
          .then((offer) => this.localConnection.setLocalDescription(offer))
          .then(() => this.sendOfferMessage({
            type: 'data-channel',
            sdp: this.localConnection.localDescription,
          }))
          .catch(this.handleCreateDescriptionError);
    },
    sendOfferMessage: function(data) {
      return this.remoteConnection
          .setRemoteDescription(data.sdp)
          .then(() => this.remoteConnection.createAnswer())
          .then((answer) => this.remoteConnection.setLocalDescription(answer))
          .then(()=> this.sendAnswerMessage({
            type: 'data-channel',
            sdp: this.remoteConnection.localDescription,
          }));
    },
    sendAnswerMessage: function(data) {
      this.localConnection
          .setRemoteDescription(data.sdp);
    },
    handleCreateDescriptionError: function(error) {
      console.log('Unable to create an offer: ' + error.toString());
    },
    handleLocalAddCandidateSuccess: function() {
      this.connectButton.disabled = true;
    },
    handleRemoteAddCandidateSuccess: function() {
      this.disconnectButton.disabled = false;
    },
    handleAddCandidateError: function() {
      console.log('Oh noes! addICECandidate failed!');
    },
    sendMessageRTC: function(message) {
      this.sendChannel.send(JSON.stringify(message));
    },
    handleSendChannelStatusChange: function(event) {

    },
    receiveChannelCallback: function(event) {
      this.receiveChannel = event.channel;
      this.receiveChannel.onmessage = this.handleReceiveMessage;
      this.receiveChannel.onopen = this.handleReceiveChannelStatusChange;
      this.receiveChannel.onclose = this.handleReceiveChannelStatusChange;
    },
    handleReceiveMessage: function(event) {
      const messasge = JSON.parse(event.data);
      this.messages.push(messasge);
    },
    handleReceiveChannelStatusChange: function(event) {
      if (this.receiveChannel) {
        console.log('Receive channel\'s status has changed to ' +
                  this.receiveChannel.readyState);
      }

    // Here you would do stuff that needs to be done
    // when the channel's status changes.
    },
    disconnectPeers: function() {
      // Close the RTCDataChannels if they're open.

      this.sendChannel.close();
      this.receiveChannel.close();

      // Close the RTCPeerConnections

      this.localConnection.close();
      this.remoteConnection.close();

      this.sendChannel = null;
      this.receiveChannel = null;
      this.localConnection = null;
      this.remoteConnection = null;
    },
  },
};
</script>

<style>

</style>
