import axios from "axios";
import queryString from "query-string";

import SecureLS from "secure-ls";

import store from "@/store";
import { AUTH_LOGOUT } from "@/constants";
import { useStore } from "vuex";

const ls = new SecureLS({
  encodingType: "rabbit",
  isCompression: true,
  encryptionSecret: process.env.VUE_APP_SECRET_LS,
});

const axiosClient = axios.create({
  baseURL: process.env.VUE_APP_URL,
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${ls.get("access-token")}`,
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

const refreshToken = () => {
  const refreshToken = ls.get("refresh-token");
  return axiosClient.post(`users/refresh-token`, { refreshToken });
};

axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  // console.log(">>>CONFIG:   ", config);
  if (ls.get("access-token"))
    config.headers.Authorization = `Bearer ${ls.get("access-token")}`;
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
      if (
        config.url !== "/users/reset-password" &&
        error.response.data.message === "jwt expired"
      ) {
        try {
          //get new access token
          const res = await refreshToken();
          const { authorization, refreshtoken } = res.headers;

          if (res.data.success) {
            //set new token in config (last request)
            config.headers.Authorization = authorization;

            //set tokens to storage:
            ls.set("refresh-token", refreshtoken);
            ls.set("access-token", authorization);

            //set access token to axios:
            axiosClient.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${authorization}`;

            return axiosClient(config);
          }
          // refresh token expired
          else {
            const route = useStore();

            await store.dispatch(`auth/${AUTH_LOGOUT}`);

            route.push({ name: "login" });
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
);

export default axiosClient;
