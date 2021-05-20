import Vue from 'vue';
import ApiService from '@/api/ApiService';
import {Profile} from '@/api/';

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

const formatLoginResponse = (response) => {
  const auth = response.data?.auth;
  const client = response.data?.client;
  const profile = Profile.responseToProfile(client);
  return {
    profile,
    auth,
  };
};

const formatSignUpResponse = (response) => {
  const auth = response.data?.auth;
  const client = response.data?.client;
  const profile = Profile.responseToProfile(client);
  return {
    profile,
    auth,
  };
};

export const AuthService = {
  async googleLogin(token) {
    const response = await Vue.axios.post('login/', {type: 'google', token});
    saveToken(response.data?.token);

    return formatLoginResponse(response);
  },
  async linkedLogin(token) {
    const response = await Vue.axios.post('login/', {type: 'linkedin', token});
    saveToken(response.data?.token);

    return formatLoginResponse(response);
  },
  async loginEmail({email, password}) {
    const response = await Vue.axios.post(
        'login/',
        {type: 'email', email, password},
    );
    saveToken(response.data?.token);

    return formatLoginResponse(response);
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
      return formatLoginResponse(response);
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
    return formatSignUpResponse(response);
  },
  async signupLinkedIn({token}) {
    const response = await Vue.axios.post('signup/', {type: 'linkedin', token});
    saveToken(response.data?.token);

    return formatSignUpResponse(response);
  },
  async signupPassword({email, password}) {
    const response = await Vue.axios.post(
        'signup/',
        {type: 'email', email, password},
    );
    saveToken(response.data?.token);

    return formatSignUpResponse(response);
  },
  async updateSignUpFlow({stage}) {
    await Vue.axios.put(
        'sign-up-flow/',
        {stage},
    );
  },
};

export default {getToken, saveToken, destroyToken, AuthService};
