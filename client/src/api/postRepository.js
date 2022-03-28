import axiosClient from "./axiosClient";

const resource = "/posts";

const postsAPI = {
  createPost: (postPayload) => {
    return axiosClient.post(`${resource}/create-post`, postPayload);
  },
  getPost: (params) => {
    return axiosClient.get(`${resource}/${params}`);
  },
  reportPost: (slugPostPayload, reportPayload) => {
    return axiosClient.post(`${resource}/${slugPostPayload}`, reportPayload);
  },
  deletePost: (slugPostPayload) => {
    return axiosClient.delete(`${resource}/delete-post`, {
      data: slugPostPayload,
    });
  },
  updatePost: (slugPost, contentPayload) => {
    return axiosClient.patch(`${resource}/${slugPost}`, contentPayload);
  },
};

export default postsAPI;
