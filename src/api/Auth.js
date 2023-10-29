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

export const AuthService = {
  async googleLogin(token) {
    const response = await Vue.axios.post('login/', {type: 'google', token});
    saveToken(response.data?.token);
    const client = response.data?.client;
    return Profile.responseToProfile(client);
  },
  async linkedLogin(token) {
    const response = await Vue.axios.post('login/', {type: 'linkedin', token});
    saveToken(response.data?.token);
    const client = response.data?.client;
    return Profile.responseToProfile(client);
  },
  async loginEmail({email, password}) {
    const response = await Vue.axios.post(
        'login/',
        {type: 'email', email, password},
    );
    saveToken(response.data?.token);
    const client = response.data?.client;
    return Profile.responseToProfile(client);
  },
  async loginAuthorized() {
    if (!getToken()) {
      return null;
    }
    const response = await Vue.axios.post(
        'login-authorized/',
    );
    saveToken(response.data?.token);
    return response.data?.client;
  },
  async signupGoogle({token, name, imageUrl}) {
    const response = await Vue.axios.post(
        'signup/',
        {type: 'google', token, name, photoURL: imageUrl},
    );
    saveToken(response.data?.token);
    const client = response.data?.client;
    return Profile.responseToProfile(client);
  },
  async signupLinkedIn({token}) {
    const response = await Vue.axios.post('signup/', {type: 'linkedin', token});
    saveToken(response.data?.token);
    const client = response.data?.client;
    return Profile.responseToProfile(client);
  },
  async signupPassword({email, password}) {
    const response = await Vue.axios.post('signup/', {email, password});
    saveToken(response.data?.token);
    const client = response.data?.client;
    return Profile.responseToProfile(client);
  },
};

export default {getToken, saveToken, destroyToken, AuthService};
