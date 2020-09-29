<template>
  <div>
      <div class="controlbox">
        <button
          id="connectButton"
          name="connectButton"
          class="buttonleft"
          v-on:click="connectPeers"
        >
          Connect
        </button>
        <button
          id="disconnectButton"
          name="disconnectButton"
          class="buttonright"
          disabled
          v-on:click="disconnectPeers"
        >
          Disconnect
        </button>
      </div>

      <div class="messagebox">
        <label for="message">Enter a message:
          <input
            type="text" name="message" id="message" placeholder="Message text"
            inputmode="latin" size=60 maxlength=120 disabled>
        </label>
        <button
          id="sendButton" name="sendButton" class="buttonright" disabled
          v-on:click="sendMessage"
        >
          Send
        </button>
      </div>
      <div class="messagebox" id="receivebox">
        <p>Messages received:</p>
      </div>
  </div>
</template>

<script>
export default {
  name: 'instant-messaging',
  data: function() {
    return {
      connectButton: null,
      disconnectButton: null,
      sendButton: null,
      messageInputBox: null,
      receiveBox: null,
      localConnection: null,
      remoteConnection: null,
      sendChannel: null,
      receiveChannel: null,
    };
  },
  mounted: function() {
    this.connectButton = document.getElementById('connectButton');
    this.disconnectButton = document.getElementById('disconnectButton');
    this.sendButton = document.getElementById('sendButton');
    this.messageInputBox = document.getElementById('message');
    this.receiveBox = document.getElementById('receivebox');
  },
  methods: {
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
          .then(() => {
            this.remoteConnection
                .setRemoteDescription(this.localConnection.localDescription);
          })
          .then(() => this.remoteConnection.createAnswer())
          .then((answer) => this.remoteConnection.setLocalDescription(answer))
          .then(() => {
            this.localConnection
                .setRemoteDescription(this.remoteConnection.localDescription);
          })
          .catch(this.handleCreateDescriptionError);
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
    sendMessage: function() {
      const message = this.messageInputBox.value;
      this.sendChannel.send(message);

      // Clear the input box and re-focus it, so that we're
      // ready for the next message.

      this.messageInputBox.value = '';
      this.messageInputBox.focus();
    },
    handleSendChannelStatusChange: function(event) {
      if (this.sendChannel) {
        const state = this.sendChannel.readyState;

        if (state === 'open') {
          this.messageInputBox.disabled = false;
          this.messageInputBox.focus();
          this.sendButton.disabled = false;
          this.disconnectButton.disabled = false;
          this.connectButton.disabled = true;
        } else {
          this.messageInputBox.disabled = true;
          this.sendButton.disabled = true;
          this.connectButton.disabled = false;
          this.disconnectButton.disabled = true;
        }
      }
    },
    receiveChannelCallback: function(event) {
      this.receiveChannel = event.channel;
      this.receiveChannel.onmessage = this.handleReceiveMessage;
      this.receiveChannel.onopen = this.handleReceiveChannelStatusChange;
      this.receiveChannel.onclose = this.handleReceiveChannelStatusChange;
    },
    handleReceiveMessage: function(event) {
      const el = document.createElement('p');
      const txtNode = document.createTextNode(event.data);

      el.appendChild(txtNode);
      this.receiveBox.appendChild(el);
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

      // Update user interface elements

      this.connectButton.disabled = false;
      this.disconnectButton.disabled = true;
      this.sendButton.disabled = true;

      this.messageInputBox.value = '';
      this.messageInputBox.disabled = true;
    },
  },
};
</script>

<style>

</style>
