import Vue from 'vue';
import ApiService from '@/api/ApiService';
import {Profile} from '@/api/';
import {getAuth} from '@/firestore';

const ID_TOKEN_KEY = 'id_token';

export const getToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

export const saveToken = (token) => {
  ApiService.setHeader(token);
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

const processLoginResponse = async (response) => {
  const auth = response.data?.auth;
  const client = response.data?.client;
  const profile = Profile.responseToProfile(client);

  await getAuth().signInWithCustomToken(auth.firebaseToken);
  return {
    profile,
    auth,
  };
};

const processSignUpResponse = async (response) => {
  const auth = response.data?.auth;
  const client = response.data?.client;
  const profile = Profile.responseToProfile(client);

  await getAuth().signInWithCustomToken(auth.firebaseToken);
  return {
    profile,
    auth,
  };
};

export const AuthService = {
  async googleLogin(token) {
    const response = await Vue.axios.post('login/', {type: 'google', token});
    saveToken(response.data?.token);

    return processLoginResponse(response);
  },
  async linkedLogin(token) {
    const response = await Vue.axios.post('login/', {type: 'linkedin', token});
    saveToken(response.data?.token);

    return processLoginResponse(response);
  },
  async loginEmail({email, password}) {
    const response = await Vue.axios.post(
        'login/',
        {type: 'email', email, password},
    );
    saveToken(response.data?.token);

    return processLoginResponse(response);
  },
  async loginAuthorized() {
    if (!getToken()) {
      return {
        profile: null,
        auth: null,
      };
    }

    try {
      const response = await Vue.axios.post(
          'login-authorized/',
      );
      saveToken(response.data?.token);
      return processLoginResponse(response);
    } catch (err) {
      destroyToken();
      throw err;
    }
  },
  async signupGoogle({token, name, imageUrl}) {
    const response = await Vue.axios.post(
        'signup/',
        {type: 'google', token, name, photoURL: imageUrl},
    );
    saveToken(response.data?.token);
    return processSignUpResponse(response);
  },
  async signupLinkedIn({token}) {
    const response = await Vue.axios.post('signup/', {type: 'linkedin', token});
    saveToken(response.data?.token);

    return processSignUpResponse(response);
  },
  async signupPassword({email, password}) {
    const response = await Vue.axios.post(
        'signup/',
        {type: 'email', email, password},
    );
    saveToken(response.data?.token);

    return processSignUpResponse(response);
  },
  async updateSignUpFlow({stage}) {
    await Vue.axios.put(
        'sign-up-flow/',
        {stage},
    );
  },
  async signOut() {
    await getAuth().signOut();
  },
};

export default {getToken, saveToken, destroyToken, AuthService};
