import axiosClient from "./axiosClient";

const resource = "/users";

const usersAPI = {
  search: (params) => {
    return axiosClient.get(`${resource}/search`, { params });
  },
  signUp: (payload) => {
    return axiosClient.post(`${resource}/sign-up`, payload);
  },
  signIn: (payload) => {
    return axiosClient.post(`${resource}/sign-in`, payload);
  },
  getUser: (params) => {
    return axiosClient.get(`${resource}/${params}`);
  },
};

export default usersAPI;
