import {
  USER_REQUEST,
  USER_ERROR,
  USER_SUCCESS,
  AUTH_LOGOUT,
} from "@/constants";
import RepositoryFactory from "@/api/repositoryFactory";
import axiosClient from "@/api/axiosClient";

const userRepository = RepositoryFactory.get("users");

export default {
  namespaced: true,
  state: {
    status: "",
    profile: {},
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
  },
};
