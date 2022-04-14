import axiosClient from "./axiosClient";

const resource = "/comments";

const commentsAPI = {
  createComment: (commentPayload) => {
    return axiosClient.post(`${resource}/create-comment`, commentPayload);
  },
  updateComment: (commentId, newContent) => {
    return axiosClient.patch(
      `${resource}/update-comment/${commentId}`,
      newContent
    );
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
