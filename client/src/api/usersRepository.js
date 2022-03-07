import axiosClient from "./axiosClient";

const resource = "/users";

const usersAPI = {
  search: (params) => {
    axiosClient.get(resource, { params });
  },
};

export default usersAPI;
