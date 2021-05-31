import Peer from 'simple-peer';

export const SCREEN_STREAM_TYPE = 'screen';
export const WEBCAM_STREAM_TYPE = 'webcam';

/**
  * This class manages simple peer webRTC clients
  */
export class WebrtcConn {
  /**
  * Constructor
  */
  constructor({
    initiator,
    peerId,
    remotePeerId,
    peerOpts = {},
    webrtcManager,
  }) {
    this.peerId = peerId;
    this.remotePeerId = remotePeerId;
    this.closed = false;
    this.connected = false;
    this.synced = false;
    this.webrtcManager = webrtcManager;
    /**
     * @type {any}
     */
    this.peer = new Peer({initiator, ...peerOpts});
    this.peer.on('signal', (signal) => {
      this.webrtcManager.publishSignalingMessage(
          {to: remotePeerId, from: peerId, type: 'signal', signal},
      );
    });
    this.peer.on('connect', () => {
      this.connected = true;
    });

    this.peer.on('close', () => {
      console.log('closed');
      this.connected = false;
      this.closed = true;
      this.webrtcManager.deleteRemotePeer(this.remotePeerId);
      this.peer.destroy();
      this.webrtcManager.announceSignalingInfo();
    });

    this.peer.on('data', (data) => {
      const parsedData = new TextDecoder().decode(data);
      const jsonData = JSON.parse(parsedData);
      this.webrtcManager.announceData(jsonData);
    });

    this.peer.on('error', (err) => {
      console.log(
          'Error in connection to ', remotePeerId, ': ', err,
      );
      this.webrtcManager.announceSignalingInfo();
    });

    this.peer.on('stream', (stream) => {
      this.webrtcManager.onPeerStream(stream);
    });
  }

  /**
  * Destroy
  */
  destroy() {
    this.peer.destroy();
  }
}


/**
  * This class manages simple peer webRTC clients
  */
export class WebrtcManager {
  /**
  * Constructor
  */
  constructor({
    peerId,
    conferenceId,
    url,
    setMediaTrack,
    announceData,
    maxConns=10,
  }) {
    this.webrtcConns = {};
    this.peerId = peerId;
    this.conferenceId = conferenceId;
    this.url = url;
    this.setMediaTrack = setMediaTrack;
    this.announceData = announceData;
    this.maxConns = maxConns;

    this.conn = new WebSocket(this.url);
    this.conn.addEventListener('message', (m) => this.onMessage(m));
    this.conn.addEventListener('open', () => this.onConnect());
    this.conn.addEventListener('close', () => this.onDisconnect);
    this.conn.addEventListener('error', (err) => this.onError(err));
  }

  /**
  * announceSignalingInfo
  */
  announceSignalingInfo() {
    if (this.conn.connected) {
      this.conn.send(
          JSON.stringify({type: 'subscribe', topics: [this.conferenceId]}),
      );
      publishSignalingMessage({type: 'announce', from: this.peerId});
    }
  }

  /**
   * addTrack
   * @param {obj} track
   * @param {obj} stream
   */
  addTrack({track, stream}) {
    Object.values(this.webrtcConns).forEach((webrtc) =>{
      webrtc.peer.addTrack(track, stream);
    });
  }

  /**
   *
   * @param {object} data
   */
  sendData(data) {
    const stringifiedData = JSON.stringify(data);
    Object.values(this.webrtcConns).forEach((webrtc) =>{
      webrtc.peer.send(stringifiedData);
    });
  }

  /**
   * removeTrack
   * @param {obj} track
   * @param {obj} stream
   */
  removeTrack({track, stream}) {
    Object.values(this.webrtcConns).forEach((webrtc) =>{
      webrtc.peer.removeTrack(track, stream);
    });
  }

  /**
  * deleteRemotePeer
  * @param {string} peerId
  */
  deleteRemotePeer(peerId) {
    if (peerId in this.webrtcConns) {
      delete this.webrtcConns[peerId];
    }
  }

  /**
  * onDisconnect
  * @param {string} peerId
  */
  onDisconnect() {
    console.log(`disconnect (${this.url})`);
  }

  /**
  * onConnect
  */
  onConnect() {
    this.conn.send(
        JSON.stringify({type: 'subscribe', topics: [this.conferenceId]}),
    );
    this.publishSignalingMessage({type: 'announce', from: this.peerId});
  }

  /**
  * onMessage
  * @param {obj} data
  */
  publishSignalingMessage(data) {
    this.conn.send(
        JSON.stringify({type: 'publish', topic: this.conferenceId, data}),
    );
  }

  /**
  * createWebRTCClient
  * @param {{initiator: boolean, remotePeerId: string}} obj input
  * @return {WebrtcConn}
  */
  createWebRTCClient({initiator, remotePeerId}) {
    const rtc = new WebrtcConn({
      initiator,
      peerId: this.peerId,
      remotePeerId,
      webrtcManager: this,
    });
    return rtc;
  }

  /**
  * onPeerStream
  * @param {obj} stream
  */
  onPeerStream(stream) {
    this.setMediaTrack(stream);
  }

  /**
  * onError
  * @param {obj} error
  */
  onError(error) {
    console.log(error);
  }

  /**
  * onMessage
  * @param {object} m
  */
  onMessage(m) {
    const message = JSON.parse(m.data);
    switch (message.type) {
      case 'publish': {
        const data = message.data;
        const peerId = this.peerId;
        if (
          data == null ||
          data.from === peerId ||
          (data.to !== undefined && data.to !== peerId)
        ) {
          // ignore messages that are not addressed to this conn
          return;
        }

        switch (data.type) {
          case 'announce':
            if (Object.keys(this.webrtcConns).length < this.maxConns) {
              if (!(data.from in this.webrtcConns)) {
                this.webrtcConns[data.from] = this.createWebRTCClient({
                  initiator: true,
                  remotePeerId: data.from,
                });
              }
            }
            break;
          case 'signal':
            if (data.to === peerId) {
              if (!(data.from in this.webrtcConns)) {
                this.webrtcConns[data.from] = this.createWebRTCClient({
                  initiator: false,
                  remotePeerId: data.from,
                });
              }
              this.webrtcConns[data.from].peer.signal(data.signal);
            }
            break;
        }
      }
    }
  }
}
