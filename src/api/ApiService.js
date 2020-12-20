import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import JwtService from '@/common/jwt.service';
import {API_URL} from '@/config';


const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = API_URL;

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
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
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

  setHeader() {
    Vue.axios.defaults.headers.common[
        'Authorization'
    ] = `Token ${JwtService.getToken()}`;
  },
};

export default ApiService;
