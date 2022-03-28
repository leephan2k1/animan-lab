import axiosClient from "./axiosClient";

const resource = "/posts";

const postsAPI = {
  createPost: (postPayload) => {
    return axiosClient.post(`${resource}/create-post`, postPayload);
  },
  getPost: (slugPost) => {
    return axiosClient.get(`${resource}/${slugPost}`);
  },
  getPrivatePost: (slugPost) => {
    return axiosClient.get(`${resource}/private-post/${slugPost}`);
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
