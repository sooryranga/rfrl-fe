import {firebase} from '@firebase/app';
import {
  roomsRef,
  usersRef,
} from '@/firestore';
import {isEqual} from 'lodash.isequal';

import {
  SET_ROOMS, SET_USERS, SET_AUTOUPDATEROOMS, SET_ROOM_LISTENER,
} from '@/constants.mutations.js';

const state = {
  rooms: {}, // Available rooms in the whole chat
  users: {},
  unsubscribeRoomListener: null,
  autoUpdateRooms: false,
};

/**
 * Will update users based on the lateset version of rooms set.
 * @param {object} commit - commit users found in rooms update.
 * @param {object} getters - getters is used to grab the latest rooms.
 */
async function updateUsers(commit, getters) {
  const rooms = Object.values(getters.rooms);
  const allUsers = getters.users;
  const roomUserIds = [];
  rooms.forEach((room) => {
    room.users.forEach((userId) => {
      if (!(userId in allUsers)) {
        roomUserIds.push(userId);
      }
    });
  });

  const users = await usersRef.where(
      firebase.firestore.FieldPath.documentId(),
      'in',
      roomUserIds,
  ).get();
  users.forEach((user) => {
    const userData = user.data();
    userData._id = user.id;
    allUsers[user.id] = userData;
  });

  commit(SET_USERS, users);
}

/**
 * Will update rooms based on the lateset version of rooms set.
 * @param {object} commit - commit users found in rooms update.
 * @param {object} getters - getters is used to grab the latest rooms.
 * @param {object} snapshot - snapshot is realtime update from firestore.
 */
async function snapshotRoomChanges(commit, getters, snapshot) {
  const rooms = Object.assign(getters.rooms);
  snapshot.docChanges().forEach(function(change) {
    const room = change.doc.data();
    room._id = change.id;
    if (change.type === 'added') {
      rooms[room._id] = room;
    }
    if (change.type === 'modified') {
      rooms[room._id] = room;
    }
    if (change.type === 'removed') {
      delete rooms[room._id];
    }
  });
  commit(SET_ROOMS, rooms);
  await updateUsers(commit, getters);
}

const getters = {
  getRoomExistsWithUsers(state, userIds) {
    const userSet = new Set(userIds);
    const rooms = Object.values(state.room);

    for (let i =0; i< rooms.length; i++) {
      const room = rooms[i];
      const userSet2 = new Set(room.users);
      if (isEqual(userSet, userSet2)) {
        return room;
      }
    }

    return null;
  },
  isAutoUpdateRooms(state) {
    return state.autoUpdateRooms;
  },
  users(state) {
    return state.users;
  },
  getUser(state, id) {
    return state.users[id];
  },
  rooms(state) {
    return state.rooms;
  },
};

const actions = {
  async fetchAndSetRooms({commit, getters, rootGetters}) {
    if (getters.isAutoUpdateRooms) {
      return getters.rooms;
    }
    const currentUserId = rootGetters['profile/currentProfile'].id;
    const query = roomsRef.where(
        'users',
        'array-contains',
        currentUserId,
    );
    const rooms = await query.get();
    const roomIdtoRoom = {};
    rooms.forEach((room) => {
      const roomData = room.data();
      roomData._id = room.id;
      roomIdtoRoom[room.id] = roomData;
    });

    query.onSnapshot(async (snapshot) => {
      await snapshotRoomChanges(commit, getters, snapshot);
    });
    commit(SET_ROOMS, roomIdtoRoom);
    commit(SET_AUTOUPDATEROOMS);
    await updateUsers(commit, getters);

    return roomIdtoRoom;
  },
  async createRoom({getters, rootGetters}, otherUserIds) {
    const currentUserId = rootGetters['profile/currentProfile'].id;
    const existingRoom = getters.getRoomExistsWithUsers(
        [...otherUserIds, currentUserId],
    );
    if (existingRoom) {
      return existingRoom._id;
    }
    return id = await roomsRef.add({users: [otherUserId, currentUserId]});
  },
};

const mutations = {
  [SET_ROOMS](state, rooms) {
    state.rooms = rooms;
  },
  [SET_USERS](state, users) {
    state.users = users;
  },
  [SET_AUTOUPDATEROOMS](state) {
    state.autoUpdateRooms = true;
  },
  [SET_ROOM_LISTENER](state, listener) {
    state.unsubscribeRoomListener = listener;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
