import Vue from 'vue';
import {
  messagesRef,
} from '@/firestore';
import {
  SET_MESSAGES, SET_MESSAGE_LISTENER, SET_LAST_MESSAGE, SET_META,
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
  getMessagesForRoom(state) {
    return (roomId) => {
      return state.roomMessage[roomId] || [];
    };
  },
  latestMessage(state) {
    return state.roomMessage.latestMessage;
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
  console.log(message);
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
 * @param {object} commit
 * @param {object} room
 * @param {object} snapshot
 */
async function snapshotMessagesAdded(commit, room, snapshot) {
  const formattedMessages = [];
  let lastMessage = null;
  snapshot.docChanges().forEach(function(change) {
    const message = change.doc.data();
    message._id = change.id;
    if (change.type !== 'added') {
      console.error('Expected only added messages');
      return;
    }
    lastMessage = message;
    const formattedMessage = formatMessage(room, message);
    formattedMessages.unshift(formattedMessage);
  });

  const messages = state.messages[room._id].concat([formattedMessage]);
  commit(SET_MESSAGES, room._id, messages);
  commit(SET_LAST_MESSAGE, room._id, lastMessage);
}


const actions = {
  async fetchAndSetMessages({commit, getters}, room, options = {}) {
    const meta = getters.getMetaForMessage(room._id);
    let start = meta?.start;
    let end = meta?.end;
    let started = meta?.started;

    const formattedMessages = [...getters.getMessagesForRoom(room._id)];

    if (end && !start) return formattedMessages;

    const ref = messagesRef(room._id);
    const query = ref.orderBy('timestamp', 'desc').limit(PER_PAGE);

    if (start) query = query.startAfter(start);

    const messages = await query.get();

    messages.forEach((rawMessage) => {
      const message = rawMessage.data();
      message._id = rawMessage.id;
      const formattedMessage = formatMessage(room, message);
      formattedMessages.unshift(formattedMessage);
    });

    if (start) end = start;
    start = messages.docs[messages.docs.length - 1];

    if (started === false) {
      const unsubscribe = await messagesRef(room._id)
          .orderBy('timestamp')
          .startAfter(start)
          .onSnapshot((snapshot) => {
            snapshotMessagesAdded(commit, room, snapshot);
          });
      commit(SET_LISTENER, room._id, unsubscribe);

      if (!messages.empty) {
        const lastMessage = messages.docs[0];
        commit(SET_LAST_MESSAGE, room._id, lastMessage);
      }
      started = true;
    }

    commit(SET_MESSAGES, room._id, formattedMessages);
    commit(SET_META, room._id, {start, end, started});

    return formattedMessages;
  },
};


const mutations = {
  [SET_MESSAGES](state, roomId, messages) {
    Vue.set(state.roomMessage, roomId, messages);
  },
  [SET_MESSAGE_LISTENER](state, roomId, listener) {
    if (state[roomId]) {
      // unsubscribe to existing listener for a room
      state.roomMessageListeners[roomId]();
    }
    Vue.set(state.roomMessageListeners, roomId, listener);
  },
  [SET_LAST_MESSAGE](state, roomId, message) {
    Vue.set(state.lastMessage, roomId, message);
  },
  [SET_META](state, roomId, meta) {
    Vue.set(state.meta, roomId, meta);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
