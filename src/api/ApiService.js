import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import {API_URL} from '@/conf';

import {Auth} from '.';


const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = API_URL;
    Vue.axios.defaults.headers.common['Content-Type'] = 'application/json';

    Vue.axios.interceptors.response.use(function(response) {
      // 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, function(error) {
      // range out of 2xx cause this function to trigger
      // Do something with response error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = error.response.status;
        const data = error.response?.data?.message;
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        if (status === 401 && data === 'invalid or expired jwt') {
          Auth.destroyToken();
        }

        return Promise.reject(error.response);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest
        // in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
      return Promise.reject(error);
    });
  },

  setHeader(token) {
    Vue.axios.defaults.headers.common[
        'Authorization'
    ] = `Bearer ${token}`;
  },
};

export default ApiService;
