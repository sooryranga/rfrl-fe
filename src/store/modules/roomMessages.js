import Vue from 'vue';
import {
  messagesRef,
} from '@/firestore';
import {
  SET_MESSAGES, SET_MESSAGE_LISTENER, SET_LATEST_MESSAGE, SET_META,
} from '@/constants.mutations.js';
import {parseTimestamp} from '@/utils';

const PER_PAGE = 20;

const state = {
  roomMessage: {}, // Available rooms in the whole chat
  roomMessageListeners: {},
  latestMessage: {},
  meta: {},
};

const getters = {
  messagesByRoomId(state) {
    return {
      messages: state.roomMessage,
      meta: state.meta,
    };
  },
  getMessagesForRoom(state) {
    return (roomId) => {
      return {
        messages: state.roomMessage[roomId] || [],
        version: state.meta[roomId]?.version || 0,
      };
    };
  },
  latestMessage(state) {
    return state.latestMessage;
  },
  getMetaForMessage(state) {
    return (roomId) => {
      return state.meta[roomId];
    };
  },
};

/**
 * Format message once retrived.
 * @param {object} room - intended room that the message will go to.
 * @param {object} message
 * @return {object}
 */
function formatMessage(room, message) {
  const senderUser = room.users.find(
      (user) => message.sender_id === user._id,
  );

  const {sender_id, timestamp} = message; // eslint-disable-line

  return {
    ...message,
    ...{
      sender_id,
      _id: message._id,
      seconds: timestamp.seconds,
      timestamp: parseTimestamp(timestamp, 'HH:mm'),
      date: parseTimestamp(timestamp, 'DD MMMM YYYY'),
      username: senderUser ? senderUser.username : null,
    },
  };
}

/**
 * Will update messages
 * @param {object} getters
 * @param {object} commit
 * @param {object} room
 * @param {object} snapshot
 */
function snapshotMessagesAdded(getters, commit, room, snapshot) {
  const formattedMessages = [];
  let lastMessage = null;
  snapshot.docChanges().forEach(function(change) {
    const message = change.doc.data();
    message._id = change.doc.id;

    if (change.type !== 'added') {
      console.error('Expected only added messages');
      return;
    }

    lastMessage = message;
    const formattedMessage = formatMessage(room, message);
    formattedMessages.unshift(formattedMessage);
  });

  const existingMessages = getters.getMessagesForRoom(room._id);
  const messages = existingMessages.messages.concat(formattedMessages);
  commit(SET_MESSAGES, {roomId: room._id, messages: messages});
  if (lastMessage) {
    commit(SET_LATEST_MESSAGE, {roomId: room._id, message: lastMessage});
  }
}


const actions = {
  async fetchAndSetMessages({commit, getters}, room, options = {}) {
    const meta = getters.getMetaForMessage(room._id);
    let start = meta?.start;
    let end = meta?.end;
    let started = meta?.started;
    const version = meta?.version || 0;

    const formattedMessages = [
      ...getters.getMessagesForRoom(room._id).messages,
    ];

    if (end && !start) return {messages: formattedMessages, loaded: true};

    const ref = messagesRef(room._id);
    let query = ref.orderBy('timestamp', 'desc').limit(PER_PAGE);

    if (start) query = query.startAfter(start);

    const messages = await query.get();

    messages.forEach((rawMessage) => {
      const message = rawMessage.data();
      message._id = rawMessage.id;
      const formattedMessage = formatMessage(room, message);
      formattedMessages.unshift(formattedMessage);
    });

    if (start) end = start;
    start = messages.docs[messages.docs.length-1];

    if (!started) {
      const unsubscribe = await messagesRef(room._id)
          .orderBy('timestamp')
          .startAfter(messages.docs[0])
          .onSnapshot((snapshot) => {
            snapshotMessagesAdded(getters, commit, room, snapshot);
          });
      commit(SET_MESSAGE_LISTENER, {roomId: room._id, listener: unsubscribe});

      if (!messages.empty) {
        const lastMessage = messages.docs[0].data();
        lastMessage._id = messages.docs[0].id;
        commit(
            SET_LATEST_MESSAGE,
            {roomId: room._id, message: lastMessage},
        );
      }
      started = true;
    }

    commit(SET_META, {roomId: room._id, meta: {start, end, started, version}});
    commit(SET_MESSAGES, {roomId: room._id, messages: formattedMessages});

    return {messages: formattedMessages, loaded: messages.empty};
  },
};


const mutations = {
  [SET_MESSAGES](state, payload) {
    Vue.set(state.roomMessage, payload.roomId, payload.messages);
    state.meta[payload.roomId].version += 1;
  },
  [SET_MESSAGE_LISTENER](state, payload) {
    if (state[payload.roomId]) {
      // unsubscribe to existing listener for a room
      state.roomMessageListeners[payload.roomId]();
    }
    Vue.set(state.roomMessageListeners, payload.roomId, payload.listener);
  },
  [SET_LATEST_MESSAGE](state, payload) {
    Vue.set(state.latestMessage, payload.roomId, payload.message);
  },
  [SET_META](state, payload) {
    Vue.set(state.meta, payload.roomId, payload.meta);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
