import {firebase} from '@firebase/app';
import {
  roomsRef,
  usersRef,
} from '@/firestore';
import {isEqual} from 'lodash.isequal';

const state = {
  rooms: {}, // Available rooms in the whole chat
  users: {},
  autoUpdateRoomListener: null,
  autoUpdateRooms: false,
};

/**
 * Will update users based on the lateset version of rooms set.
 * @param {object} commit - commit users found in rooms update.
 * @param {object} getters - getters is used to grab the latest rooms.
 */
async function updateUsers(commit, getters) {
  const rooms = Object.values(getters.getRooms());
  const allUsers = getters.getUsers();
  const roomUserIds = [];
  rooms.forEach((room) => {
    room.data().users.forEach((userId) => {
      if (!(userId in allUsers)) {
        roomUserIds.push(userId);
      }
    });
  });

  users = await usersRef.where(
      firebase.firestore.FieldPath.documentId(),
      'in',
      roomUserIds,
  );
  users.forEach((user) => {
    allUsers[user.id] = user;
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
  const rooms = Object.assign(getters.getRooms());
  snapshot.docChanges().forEach(function(change) {
    const room = change.doc.data();
    if (change.type === 'added') {
      rooms[room.id] = room;
    }
    if (change.type === 'modified') {
      rooms[room.id] = room;
    }
    if (change.type === 'removed') {
      delete rooms[room.id];
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
      const userSet2 = new Set(room.users);
      if (isEqual(userSet, userSet2)) {
        return true;
      }
    }

    return false;
  },
  getUsers(state) {
    return state.users;
  },
};

const actions = {
  async fetchAndSetRooms({commit, getters, rootGetters}) {
    if (state.autoUpdateRooms) {
      return getters.getRooms();
    }
    const currentUserId = rootGetters.profile.currentProfile().id;
    const query = roomsRef.where(
        'users',
        'array-contains',
        currentUserId,
    );
    const rooms = await query.get();
    roomIdtoRoom = {};
    rooms.forEach((room) => {
      roomIdtoRoom[room._id] = room;
    });
    state.room = roomIdtoRoom;
    await updateUsers(rooms);

    query.onSnapshot(async (snapshot) => {
      await snapshotRoomChanges(commit, getters, snapshot);
    });
    commit(SET_ROOMS, roomIdtoRoom);
    commit(SET_AUTOUPDATEROOMS);
    await updateUsers(roomIdtoRoom);
  },
  async createRoom({rootGetters}, otherUserId) {
    const currentUserId = rootGetters.profile.currentProfile().id;
    await roomsRef.add({users: [otherUserId, currentUserId]});
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
};

export default {
  state,
  getters,
  actions,
  mutations,
};
