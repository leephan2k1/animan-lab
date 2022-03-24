import store from "@/store";

export const isNotAuthenticated = (to, from, next) => {
  if (!store?.getters["auth/isAuthenticated"]) {
    next();
    return;
  }
  next("/");
};

export const isAuthenticated = (to, from, next) => {
  if (store?.getters["auth/isAuthenticated"]) {
    next();
    return;
  }
  next("/login");
};
