import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: process.env.VUE_APP_URL,
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access-token")}`,
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

const refreshToken = () => {
  const refreshToken = window.localStorage.getItem("refresh-token");
  return axiosClient.post(`users/refresh-token`, { refreshToken });
};

axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  // console.log(">>>CONFIG:   ", config);
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    "access-token"
  )}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      // console.log("truoc khi respons:::", response);
    }
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      const { config } = error.response;
      console.log(error.response);
      if (error.response.data.message === "jwt expired") {
        //get new access token
        const res = await refreshToken();
        const { authorization, refreshtoken } = res.headers;

        if (res.data.success) {
          //set new token in config (last request)
          config.headers.Authorization = authorization;

          //set tokens to storage:
          localStorage.setItem("refresh-token", refreshtoken);
          localStorage.setItem("access-token", authorization);

          //set access token to axios:
          axiosClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${authorization}`;

          return axiosClient(config);
        }
      }
    }
  }
);

export default axiosClient;
