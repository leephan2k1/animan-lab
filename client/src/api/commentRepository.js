import axios from "axios";
import axiosClient from "./axiosClient";

const resource = "/comments";

const commentsAPI = {
  createComment: (commentPayload) => {
    return axiosClient.post(`${resource}/comment`, commentPayload);
  },
  updateComment: (commentId, newContent) => {
    return axiosClient.patch(`${resource}/comment/${commentId}`, newContent);
  },
  deleteComment: (commentId) => {
    return axiosClient.delete(`${resource}/comment/${commentId}`);
  },

  getComments: (params) => {
    return axiosClient.get(`${resource}`, { params });
  },
  likeComment: (id) => {
    return axiosClient.post(`${resource}/like`, id);
  },
  unLikeComment: (id) => {
    return axiosClient.post(`${resource}/unlike`, id);
  },
};

export default commentsAPI;
