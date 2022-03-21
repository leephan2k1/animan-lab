import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  USER_SETTER,
  USER_LOGOUT,
} from "@/constants";
import RepositoryFactory from "@/api/repositoryFactory";
import axiosClient from "@/api/axiosClient";

const userRepository = RepositoryFactory.get("users");

export default {
  namespaced: true,
  state: {
    token: window.localStorage.getItem("access-token") || "",
    refreshToken: window.localStorage.getItem("refresh-token") || "",
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
          localStorage.setItem("refresh-token", refreshtoken);
          localStorage.setItem("access-token", authorization);

          //set access token to axios:
          axiosClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${authorization}`;

          //set data to vuex:
          commit(AUTH_SUCCESS, { authorization, refreshtoken });

          //store user info to vuex:
          const { user } = response.data;
          dispatch(`user/${USER_SETTER}`, user, { root: true });
        } else {
          commit(AUTH_ERROR, response.data.message);
        }
      } catch (err) {
        console.log(err);
        commit(AUTH_ERROR, "error");
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
      }
    },
    [AUTH_LOGOUT]: ({ commit, dispatch, state }) => {
      return new Promise(async (resolve, reject) => {
        const { refreshToken } = state;

        const res = await userRepository.signOut({ refreshToken });

        if (res?.data?.success) {
          commit(AUTH_LOGOUT);
          //remove in localStorage
          localStorage.removeItem("access-token");
          localStorage.removeItem("user");
          localStorage.removeItem("refresh-token");
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
