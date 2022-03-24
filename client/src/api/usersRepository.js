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
  signOut: (payload) => {
    return axiosClient.delete(`${resource}/sign-out`, { data: payload });
  },
  getUser: (params) => {
    return axiosClient.get(`${resource}/${params}`);
  },
  addBookmarkPost: (userName, postIdPayload) => {
    return axiosClient.post(`${resource}/${userName}/bookmark`, postIdPayload);
  },
  removeBookmarkPost: (userName, postIdPayload) => {
    return axiosClient.delete(`${resource}/${userName}/bookmark`, {
      data: postIdPayload,
    });
  },
};

export default usersAPI;
