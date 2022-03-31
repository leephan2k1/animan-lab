import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  USER_SETTER,
  USER_LOGOUT,
  USER_REQUEST,
} from "@/constants";
import RepositoryFactory from "@/api/repositoryFactory";
import axiosClient from "@/api/axiosClient";

const userRepository = RepositoryFactory.get("users");

import SecureLS from  "secure-ls";
const ls = new SecureLS({
  encodingType: "rabbit",
  isCompression: true,
  encryptionSecret: process.env.VUE_APP_SECRET_LS,
});

export default {
  namespaced: true,
  state: {
    token: ls.get("access-token") || "",
    refreshToken: ls.get("refresh-token") || "",
    status: "",
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    authStatus: (state) => state.status,
  },
  mutations: {
    [AUTH_REQUEST]: (state) => {
      state.status = "loading";
    },
    [AUTH_SUCCESS]: (state, payload) => {
      state.status = "success";
      state.token = payload.authorization;
      state.refreshToken = payload.refreshtoken;
    },
    [AUTH_ERROR]: (state, message) => {
      state.status = message || "error";
    },
    [AUTH_LOGOUT]: (state) => {
      state.status = "success";
      state.token = "";
      state.refreshToken = "";
    },
  },
  actions: {
    [AUTH_REQUEST]: async ({ commit, dispatch }, user) => {
      try {
        commit(AUTH_REQUEST);
        let response;

        if (user.requestType === "signUp") {
          delete user.requestType;
          response = await userRepository.signUp(user);
        }

        if (user.requestType === "signIn") {
          delete user.requestType;
          response = await userRepository.signIn(user);
        }

        if (!response) {
          commit(AUTH_ERROR);
          return;
        }

        const { authorization, refreshtoken } = response.headers;

        if (response.data.success) {
          //set tokens to storage:
          ls.set("refresh-token", refreshtoken);
          ls.set("access-token", authorization);

          //set access token to axios:
          axiosClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${authorization}`;

          //set data to vuex:
          commit(AUTH_SUCCESS, { authorization, refreshtoken });

          //store user info to vuex:
          const { user } = response.data;
          dispatch(`user/${USER_SETTER}`, user, { root: true });
          dispatch(`user/${USER_REQUEST}`, user.user_name, { root: true });
        } else {
          commit(AUTH_ERROR, response.data.message);
        }
      } catch (err) {
        console.log(err);
        commit(AUTH_ERROR, "error");
        ls.remove("access-token");
        ls.remove("refresh-token");
      }
    },
    [AUTH_LOGOUT]: ({ commit, dispatch, state }) => {
      return new Promise(async (resolve, reject) => {
        const { refreshToken } = state;

        const res = await userRepository.signOut({ refreshToken });

        if (res?.data?.success) {
          commit(AUTH_LOGOUT);
          //remove in localStorage
          ls.remove("access-token");
          ls.remove("usr");
          ls.remove("_secure__ls__metadata");
          ls.remove("refresh-token");
          //remove in axios
          delete axiosClient.defaults.headers.common["Authorization"];
          //remove in vuex
          dispatch(`user/${USER_LOGOUT}`, "", { root: true });
        } else {
          commit(AUTH_ERROR);
          reject();
        }

        resolve();
      });
    },
  },
};
