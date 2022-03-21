import axiosClient from "./axiosClient";

const resource = "/posts";

const postsAPI = {
  createPost: (postPayload) => {
    return axiosClient.post(`${resource}/create-post`, postPayload);
  },
};

export default postsAPI;
