import store from "@/store";

export const avatarHandler = (user) => {
  const isLogged = store.getters["auth/isAuthenticated"];

  if (!user?.avatar) {
    if (isLogged) {
      user.avatar = require("@/assets/images/defaultAvatar.jpg");
    }
    return require("@/assets/images/defaultAvatar.jpg");
  } else {
    return user?.avatar;
  }
};
