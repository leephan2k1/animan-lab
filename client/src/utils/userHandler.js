export const avatarHandler = (user) => {
  if (!user?.avatar) {
    user.avatar = require("@/assets/images/defaultAvatar.jpg");
    return require("@/assets/images/defaultAvatar.jpg");
  } else {
    return user?.avatar;
  }
};
