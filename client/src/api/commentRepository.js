import axiosClient from "./axiosClient";

const resource = "/comments";

const commentsAPI = {
  createComment: (commentPayload) => {
    return axiosClient.post(`${resource}/create-comment`, commentPayload);
  },
};

export default commentsAPI;
