import { createStore } from "vuex";
import auth from "./auth";
import user from "./user";

export default createStore({
  modules: {
    auth,
    user,
  },
});
