import {
  USER_REQUEST,
  USER_ERROR,
  USER_SUCCESS,
  AUTH_LOGOUT,
  USER_SETTER,
  USER_LOGOUT,
  USER_UPDATE,
} from "@/constants";
import RepositoryFactory from "@/api/repositoryFactory";

import SecureLS from "secure-ls";
const ls = new SecureLS({
  encodingType: "rabbit",
  isCompression: false,
  encryptionSecret: process.env.VUE_APP_SECRET_LS,
});

const userRepository = RepositoryFactory.get("users");

export default {
  namespaced: true,
  state: {
    status: "",
    profile: ls.get("usr") || {},
  },
  getters: {
    getProfile: (state) => state.profile,
    isProfileLoaded: (state) => !!state.profile.name,
  },
  mutations: {
    [USER_REQUEST]: (state) => {
      state.status = "loading";
    },
    [USER_SUCCESS]: (state, user) => {
      state.status = "success";
      state.profile = user;
    },
    [USER_ERROR]: (state, message) => {
      state.status = message || "error";
    },
    [AUTH_LOGOUT]: (state) => {
      state.profile = {};
    },
  },
  actions: {
    [USER_REQUEST]: async ({ commit, dispatch }, userName) => {
      try {
        commit(USER_REQUEST);
        const response = await userRepository.getUser(userName);

        if (response.data.success) {
          //set data to vuex:
          commit(USER_SUCCESS, response.data.user);
        } else {
          commit(AUTH_ERROR, response.data.message);
          commit(AUTH_LOGOUT);
        }
      } catch (err) {
        console.log(err);
        commit(USER_ERROR, "error");
        dispatch(`auth/${AUTH_LOGOUT}`);
      }
    },
    [USER_SETTER]: ({ commit }, userPayload) => {
      commit(USER_SUCCESS, userPayload);
      ls.set("usr", userPayload);
    },
    [USER_UPDATE]: ({ commit }, userPayload) => {
      commit(USER_SUCCESS, userPayload);
    },
    [USER_LOGOUT]: ({ commit }) => {
      commit(AUTH_LOGOUT);
    },
  },
};
