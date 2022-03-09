import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: process.env.VUE_APP_URL,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  // console.log(">>>CONFIG:   ", config);
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      console.log("truoc khi respons data:::", response.data);
      console.log("truoc khi respons:::", response);
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);

export default axiosClient;
