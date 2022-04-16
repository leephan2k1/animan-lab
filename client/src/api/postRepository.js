import axiosClient from "./axiosClient";

const resource = "/posts";

const postsAPI = {
  createPost: (postPayload) => {
    return axiosClient.post(`${resource}`, postPayload);
  },
  deletePost: (slugPostPayload) => {
    return axiosClient.delete(`${resource}`, {
      data: slugPostPayload,
    });
  },
  searchPost: (params) => {
    return axiosClient.get(`/search`, { params });
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
  updatePost: (slugPost, contentPayload) => {
    return axiosClient.patch(`${resource}/${slugPost}`, contentPayload);
  },
};

export default postsAPI;
