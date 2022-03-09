import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
} from "@/constants";
import RepositoryFactory from "@/api/repositoryFactory";
import axiosClient from "@/api/axiosClient";

const userRepository = RepositoryFactory.get("users");

export default {
  namespaced: true,
  state: {
    token: window.sessionStorage.getItem("access-token") || "",
    refeshToken: window.localStorage.getItem("refresh-token") || "",
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
      state.refeshToken = payload.refreshtoken;
    },
    [AUTH_ERROR]: (state, message) => {
      state.status = message || "error";
    },
  },
  actions: {
    [AUTH_REQUEST]: async ({ commit }, user) => {
      try {
        commit(AUTH_REQUEST);
        const response = await userRepository.signUp(user);
        const { authorization } = response.headers;
        const { refreshtoken } = response.headers;

        if (response.data.success) {
          //set tokens to storage:
          localStorage.setItem("refresh-token", refreshtoken);
          sessionStorage.setItem("access-token", authorization);

          //set access token to axios:
          axiosClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${authorization}`;

          //set data to vuex:
          commit(AUTH_SUCCESS, { authorization, refreshtoken });
        } else {
          commit(AUTH_ERROR, response.data.message);
        }
      } catch (err) {
        console.log(err);
        commit(AUTH_ERROR, "error");
        sessionStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
      }
    },
    [AUTH_LOGOUT]: ({ commit }) => {
      return new Promise((resolve) => {
        commit(AUTH_LOGOUT);

        sessionStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");

        delete axiosClient.defaults.headers.common["Authorization"];

        resolve();
      });
    },
  },
};
