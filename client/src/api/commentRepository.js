import axiosClient from "./axiosClient";

const resource = "/comments";

const commentsAPI = {
  createComment: (commentPayload) => {
    return axiosClient.post(`${resource}/create-comment`, commentPayload);
  },
  getComments: (params) => {
    return axiosClient.get(`${resource}`, { params });
  },
};

export default commentsAPI;
