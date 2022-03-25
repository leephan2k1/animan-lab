import axiosClient from "./axiosClient";

const resource = "/posts";

const postsAPI = {
  createPost: (postPayload) => {
    return axiosClient.post(`${resource}/create-post`, postPayload);
  },
  getPost: (params) => {
    return axiosClient.get(`${resource}/${params}`);
  },
  deletePost: (slugPostPayload) => {
    return axiosClient.delete(`${resource}/delete-post`, {
      data: slugPostPayload,
    });
  },
};

export default postsAPI;
