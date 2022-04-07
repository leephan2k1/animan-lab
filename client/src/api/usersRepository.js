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
  resetPassEmail: (email, tokenCofig) => {
    return axiosClient.post(`${resource}/reset-password-email`, email);
  },
  resetPassword: (password, token) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    return axiosClient.patch(`${resource}/reset-password`, password, config);
  },
  signOut: (payload) => {
    return axiosClient.delete(`${resource}/sign-out`, { data: payload });
  },
  getUser: (params) => {
    return axiosClient.get(`${resource}/${params}`);
  },
  updateUser: (userName, newProfilePayload) => {
    return axiosClient.patch(`${resource}/${userName}`, newProfilePayload);
  },
  getMyPosts: (userName) => {
    return axiosClient.get(`${resource}/${userName}/posts`);
  },
  addBookmarkPost: (userName, postIdPayload) => {
    return axiosClient.post(`${resource}/${userName}/bookmark`, postIdPayload);
  },
  getBookmarkList: (userName) => {
    return axiosClient.get(`${resource}/${userName}/bookmark`);
  },
  removeBookmarkPost: (userName, postIdPayload) => {
    return axiosClient.delete(`${resource}/${userName}/bookmark`, {
      data: postIdPayload,
    });
  },
  addLikePost: (userName, postIdPayload) => {
    return axiosClient.post(`${resource}/${userName}/like`, postIdPayload);
  },
  getLikeList: (userName) => {
    return axiosClient.get(`${resource}/${userName}/like`);
  },
  removeLikePost: (userName, postIdPayload) => {
    return axiosClient.delete(`${resource}/${userName}/like`, {
      data: postIdPayload,
    });
  },
  addWaifu: (userName, waifuPayload) => {
    return axiosClient.post(`${resource}/${userName}/mylove`, waifuPayload);
  },
  getWaifu: (userName) => {
    return axiosClient.get(`${resource}/${userName}/mylove`);
  },
  removeWaifu: (userName, waifuId) => {
    return axiosClient.delete(`${resource}/${userName}/mylove`, {
      data: waifuId,
    });
  },
};

export default usersAPI;
